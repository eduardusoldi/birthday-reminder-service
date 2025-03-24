require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";


app.use(cors()); 
app.use(express.json()); 

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB inside Docker!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
