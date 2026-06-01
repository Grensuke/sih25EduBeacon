const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.error(
        '[Hint] Local MongoDB is not running. Use MongoDB Atlas and set MONGODB_URI in server/.env'
      );
    }
    throw error;
  }
};

module.exports = connectDB;
