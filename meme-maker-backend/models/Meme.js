// models/Meme.js
const mongoose = require('mongoose');

// The royal meme scroll (schema)
const memeSchema = new mongoose.Schema({
    imageUrl: String,
    topText: String,
    bottomText: String,
    likes: {
        type: Number,
        default: 0
      },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Meme', memeSchema);
