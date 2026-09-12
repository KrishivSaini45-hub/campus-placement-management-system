import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('ERROR: MONGO_URI is not defined in environment variables!');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do NOT process.exit(1) here so the server stays alive 
    // and returns a JSON error with CORS headers instead of a 502 Proxy crash!
  }
};

export default connectDB;
