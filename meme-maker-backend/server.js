// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Let memes from any frontend come in
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/memes', require('./routes/memeRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); 

// Connect to MongoDB – your meme warehouse
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('🟢 Connected to Meme Database');
    app.listen(5000, () => console.log('🚀 Meme Server is running on port 5000'));
})
.catch(err => console.log('❌ Database Error:', err));
