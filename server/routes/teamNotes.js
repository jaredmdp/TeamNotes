
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Note = require('../models/Notes');

router.use(auth);

// GET all notes
router.get('/notes', async (req, res) => {
  try { 
    const userId = req.user._id;
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (error) {
    console.error('Error getting notes for user:', error);
    res.status(500).json({ error: 'Error getting notes for user' });
  }
});

// CREATE a note
router.post('/notes', async (req, res) => {
  try {
    const {title, content} = req.body;
    const userId = req.userId || '65690d6949bd29d15ef73374'; //for testing purposes

    const newNote = new Note({
      title,
      content,
      userId,
    });
  
    await newNote.save();
    res.status(201).json({message : 'Note created successfully'});
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({error : 'Failed to create note'});
  }
});

module.exports = router;
