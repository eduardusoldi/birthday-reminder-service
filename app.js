require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(router);
app.use(errorHandler)

module.exports = app;
