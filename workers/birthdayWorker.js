require("dotenv").config();
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const cron = require("node-cron");
const User = require("../models/User"); // Ensure you have a User model

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";

// Connect to MongoDB (only once)
mongoose.connect(MONGO_URI, { dbName: "mydatabase" })
  .then(() => console.log("🎂 Birthday Worker: Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function sendBirthdayMessages() {
  const nowUTC = moment().utc(); // ✅ Get current UTC time

  try {
    const users = await User.find({}); // ✅ Fetch all users
    console.log(`🔍 Checking birthdays for ${users.length} users...`);

    const birthdayUsers = users.filter((user) => {
      const userTime = nowUTC.clone().tz(user.timezone); // ✅ Convert UTC to user's timezone
      return (
        moment(user.birthday).tz(user.timezone).format("MM-DD") === userTime.format("MM-DD") &&
        userTime.format("HH") === "09"
      );
    });

    if (birthdayUsers.length > 0) {
      const names = birthdayUsers.map(user => user.name).join(", ");
      const emails = birthdayUsers.map(user => user.email).join(", ");

      console.log(`🎉 Found users with birthday today: ${names}`);
      console.log(`🎉 Sending birthday email to: ${emails}`);
      
      // Simulate email sending
      birthdayUsers.forEach(user => {
        console.log(`📩 Happy Birthday, ${user.name}! Email sent to ${user.email}`);
      });
    } else {
      console.log("✅ No birthdays at this hour.");
    }
  } catch (error) {
    console.error("❌ Error checking birthdays:", error);
  }
}

// Schedule to run **every hour**
cron.schedule("0 * * * *", () => {
  console.log("⏳ Running birthday worker...");
  sendBirthdayMessages();
});

// Run immediately on start
sendBirthdayMessages();
