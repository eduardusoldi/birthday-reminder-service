const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: [require("validator").isEmail, "Invalid email format"] 
  },
  birthday: { 
    type: String, 
    required: true, 
    validate: [require("validator").isISO8601, "Invalid date format"] 
  },
  timezone: {
    type: String,
    required: true,
    validate: {
      validator: function (tz) {
        console.log("Validating timezone:", tz);  // 🔍 Debugging log
        return moment.tz.names().includes(tz);
      },
      message: "Invalid IANA timezone",
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
