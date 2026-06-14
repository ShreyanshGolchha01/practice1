import mongoose from "mongoose";
const connectDB = async () => {
    try{
        await mongoose.connect(
            process.env.MONGODB,
        );
        console.log('MongoDB connected successfully');
    }
    catch(err)
    {
        console.error('MongoDB connection error:', err.message);
    }
}
export default connectDB;