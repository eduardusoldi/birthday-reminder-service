const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const validateTimezone = (timezone) => {
  return momentTimezone.tz.zone(timezone) !== null;
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validateEmail, "Invalid email format"]
  },
  birthday: {
    type: Date,
    required: [true, "Birthday is required"],
    validate: {
      validator: function (value) {
        return value <= Date.now();
      },
      message: "Birthday must be a valid date in the past"
    }
  },
  timezone: {
    type: String,
    required: [true, "Timezone is required"],
    validate: [validateTimezone, "Invalid IANA timezone"]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
