import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  subjectiveAnswers: [answerSchema], // ✅ store subjective answers
  college: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  quizScore: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  passGenerated: { type: Boolean, default: false },
});

export default mongoose.model("Participant", userSchema);
