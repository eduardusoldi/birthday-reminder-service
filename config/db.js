const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";

// Use a different database for testing
const MONGO_URI_TEST = process.env.MONGO_URI_TEST || "mongodb://mongodb:27017/mydatabase_test";

const connectDB = async (isTestEnv = false) => {
  try {
    const dbURI = isTestEnv ? MONGO_URI_TEST : MONGO_URI;  // Use the test database URI if in the test environment

    await mongoose.connect(dbURI, {
      dbName: isTestEnv ? "mydatabase_test" : "mydatabase",  // Choose the correct database based on environment
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
