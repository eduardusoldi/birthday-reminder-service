require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const moment = require("moment-timezone");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/mydatabase";
mongoose.connect(MONGO_URI, { dbName: "mydatabase" })

const sendBirthdayMessages = async () => {
  try {
    const startDate = moment().subtract(1, "day").format("MM-DD");
    const endDate = moment().add(1, "day").format("MM-DD");

    console.log(`🔍 Checking users with birthdays between ${startDate} and ${endDate}`);

    const allUsers = await User.find({});
    console.log(`👥 Found ${allUsers.length} users in the database`);

    // Filter to find within yesterday until tomorrow
    const usersWithBirthday = await User.find({
      $expr: {
        $and: [
          {
            $gte: [{ $dateToString: { format: "%m-%d", date: "$birthday" } }, startDate],
          },
          {
            $lte: [{ $dateToString: { format: "%m-%d", date: "$birthday" } }, endDate],
          },
        ],
      },
    });

    console.log(`🎉 Found ${usersWithBirthday.length} users with birthdays in range`);

    let validBirthdayUsers = [];

    for (const user of usersWithBirthday) {
        const userLocalDate = moment(user.birthday).tz(user.timezone).format("MM-DD");
        const todayLocal = moment().tz(user.timezone).format("MM-DD");

        if (userLocalDate === todayLocal) {
          validBirthdayUsers.push(user);
        }

      }      
    // Determine if in user timezone is 9.00AM or not
    for (const user of validBirthdayUsers) {
        const userLocalTime = moment().tz(user.timezone).format("HH");
  
        if (userLocalTime === "09") {
          console.log(`🎉 Happy Birthday, ${user.name}!`);
          console.log(`📩 Sending birthday email to: ${user.email}`);
        } else {
          console.log(`⏳ Not 9 AM yet in ${user.timezone}, skipping ${user.name}`);
        }
      }
    } catch (error) {
      console.error("⚠️ Error in Birthday Worker:", error);
    }
};

// Schedule Worker to Run Every Hour
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running Birthday Worker...");
  await sendBirthdayMessages();
});

console.log("🎯 Birthday Worker Scheduled to Run Every Hour");

module.exports = {sendBirthdayMessages}