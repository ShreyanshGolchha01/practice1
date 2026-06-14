import mongoose from "mongoose";
const connectDB = async () => {
    try{
        await mongoose.connect(
            'mongodb+srv://root:12345@skillbridge.bmnzbqh.mongodb.net/practice1?retryWrites=true&w=majority',
        );
        console.log('MongoDB connected successfully');
    }
    catch(err)
    {
        console.error('MongoDB connection error:', err.message);
    }
}
export default connectDB;