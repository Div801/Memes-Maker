const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // remove spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // minimum password length
  },
}, { timestamps: true }); // will automatically add createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

module.exports = User;
