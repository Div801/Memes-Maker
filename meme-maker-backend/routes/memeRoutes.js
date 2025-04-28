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

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded!' });
    }

    const imageUrl = `http://localhost:5000/api/memes/uploads/${req.file.filename}`;

    const meme = new Meme({
      imageUrl,
      topText: caption,
      bottomText: "" // or remove if you are not using
    });

    await meme.save();
    res.status(201).json(meme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '💥 Meme failed to upload' });
  }
});

// GET: All memes (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        topText: { $regex: search, $options: "i" }, // Case-insensitive search
      };
    }

    const memes = await Meme.find(query).sort({ createdAt: -1 });
    res.json(memes);
  } catch (err) {
    res.status(500).json({ error: '💥 Meme delivery failed' });
  }
});

// DELETE: Delete a meme
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Meme.findByIdAndDelete(id);
    res.json({ message: '🗑️ Meme deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Failed to delete meme' });
  }
});

module.exports = router;
