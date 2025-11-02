
import mongoose from 'mongoose'

export const corsOptions = { origin: ["http://localhost:5173", process.env.CLIENT_URL] }

const connectDB = (uri) => {
    mongoose.connect(uri, { dbName: "WorkShop" })
        .then((data) => console.log(`connected to DB ${data.connection.host}`))
        .catch((err) => { console.log(err) })
}
export default connectDB