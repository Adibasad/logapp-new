import mongoose from 'mongoose';

console.log("Mongo URI:", process.env.MONGO_URI);

const connectDB = async () => {
    

    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI!);
};

export default connectDB;
