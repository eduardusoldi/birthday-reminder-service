require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const moment = require("moment-timezone");

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";
const databaseName = process.env.dbName || "mydatabase"

// Connect worker to database
mongoose
  .connect(MONGO_URI, { dbName: databaseName })
  .then(() => console.log("🎂 Birthday Worker: Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// The worker
async function checkBirthdays() {
  const nowUTC = moment.utc(); // Get current UTC time
  console.log("🕒 Current UTC time:", nowUTC.format());

  // Fetch users whose birthday is today
  const users = await User.find();
  console.log(`🔍 Checking birthdays for ${users.length} users...`);

  for (const user of users) {
    const { name, email, birthday, timezone } = user;
    if (!timezone) continue;

    // Check the timezone using moment-timezone
    const todayLocal = moment.tz(timezone).startOf("day");
    const userBirthdayLocal = todayLocal.set({
      month: moment(birthday).month(),
      date: moment(birthday).date(),
      hour: 9,
      minute: 0,
      second: 0
    });

    // Convert to UTC
    const userBirthdayUTC = userBirthdayLocal.clone().utc();

    // Check if current UTC time matches
    if (nowUTC.isSame(userBirthdayUTC, "hour")) {
      console.log(`🎉 Happy Birthday, ${name}! 🎂 (Email: ${email})`);
      // Add email sending logic here
    }
  }
}

checkBirthdays()
  .then(() => {
    console.log("✅ Birthday check completed.");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Internal server error:", err));
