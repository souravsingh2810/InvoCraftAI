import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sourav28sachin23_db_user:3hOC6WGALJ3ipQ7Q@cluster0.yt7zieg.mongodb.net/Invoice')
    .then(() => {console.log('DB CONNECTED')})
}