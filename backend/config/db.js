import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        console.log('====================================');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('====================================');
        process.exit(1); // Exit the process with failure
    }   
}