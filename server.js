import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB, { corsOptions } from './constant/config.js';
import Participant from "./model/participant.js";

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
dotenv.config({
  path: "./.env",
})
const port = process.env.PORT || 3000
const url = process.env.MONGO_URI
connectDB(url)

app.post("/register", async (req, res) => {
  const { name, email, phone, course, college, branch } = req.body;
  try {
    // Check duplicate user
    const existingUser = await Participant.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already registered!" });

    const user = await Participant.create({ name, email, phone, college, branch, course });
    res.json({ message: "Registration successful!", user });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/objective", async (req, res) => {
  try {
    const { email, score } = req.body;

    if (!email || score === undefined)
      return res.status(400).json({ message: "Missing email or score" });

    const user = await Participant.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passed = score >= 3;

    user.quizScore = score;
    user.passed = passed;

    await user.save();

    res.json({ message: "✅ Score saved successfully", score });
  } catch (error) {
    console.error("Objective Quiz Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/subjective", async (req, res) => {
  try {
    const { email, answers } = req.body;
    console.log(email)
    if (!email || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Invalid quiz submission" });
    }

    const user = await Participant.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.subjectiveAnswers = answers;
    await user.save();

    res.json({ message: "✅ Subjective answers submitted successfully" });
  } catch (error) {
    console.error("Subjective Quiz Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getpass", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await Participant.findOne({ email });
  if (!user || !user.passed)
    return res.status(403).json({ message: "User not eligible" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    eventName: "Workshop 2025",
    venue: "Raipur",
  });
});





app.listen(port, () => console.log(`Server running on ${port}`));
