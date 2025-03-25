require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

mongoose.connect(MONGO_URI, {
  dbName: "mydatabase", 
})
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(router);
app.use(errorHandler)

module.exports = app;
