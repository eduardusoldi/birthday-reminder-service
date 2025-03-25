const mongoose = require('mongoose');
const momentTimezone = require('moment-timezone');

// Email validation
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Timezone validation using moment-timezone
const validateTimezone = (timezone) => {
  return momentTimezone.tz.zone(timezone) !== null;
};

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true, // Removes any leading/trailing spaces
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
      validator: function(value) {
        // Check if birthday is a valid date and not in the future
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
