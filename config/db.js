const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "mydatabase",
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
