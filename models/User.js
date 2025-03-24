const mongoose = require('mongoose');

// Email validation function
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    validate: [validateEmail, "Invalid email format"]
  },
  birthday: { 
    type: Date, 
    required: [true, "Birthday is required"]
  },
  timezone: { 
    type: String, 
    required: [true, "Timezone is required"] 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
