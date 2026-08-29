const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoUri = (process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carwebsite").trim();
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // stop the app if the DB isn't reachable
  }
}

module.exports = connectDB;