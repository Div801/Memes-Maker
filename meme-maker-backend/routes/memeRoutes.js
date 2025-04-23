const express = require('express');
const router = express.Router();
const Meme = require('../models/Meme');
const multer = require('multer');
const path = require('path');

// Storage config for uploaded memes
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Serve uploaded images statically
router.use('/uploads', express.static('uploads'));

// POST: Upload meme with image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { caption } = req.body;
        const imageUrl = `http://localhost:5000/api/memes/uploads/${req.file.filename}`;

        const meme = new Meme({
            imageUrl,
            topText: caption,
            bottomText: '' // or remove if you're not using it
        });

        await meme.save();
        res.status(201).json(meme);
    } catch (err) {
        console.error(err);
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
