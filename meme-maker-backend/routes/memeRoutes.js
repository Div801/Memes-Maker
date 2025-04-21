// routes/memeRoutes.js
const express = require('express');
const router = express.Router();
const Meme = require('../models/Meme');

// POST: Add a new meme
router.post('/', async (req, res) => {
    try {
        const { imageUrl, topText, bottomText } = req.body;
        const meme = new Meme({ imageUrl, topText, bottomText });
        await meme.save();
        res.status(201).json(meme);
    } catch (err) {
        res.status(500).json({ error: '💥 Meme failed to upload' });
    }
});

// GET: All memes
router.get('/', async (req, res) => {
    try {
        const memes = await Meme.find().sort({ createdAt: -1 });
        res.json(memes);
    } catch (err) {
        res.status(500).json({ error: '💥 Meme delivery failed' });
    }
});

module.exports = router;
