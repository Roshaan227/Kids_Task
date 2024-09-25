const express = require('express');
const { Hobby, User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Pre-built hobbies
const preBuiltHobbies = [
  { hobbyName: 'Football', hobbyImage: 'football.jpg' },
  { hobbyName: 'Reading', hobbyImage: 'reading.jpg' },
  { hobbyName: 'Cycling', hobbyImage: 'cycling.jpg' },
  { hobbyName: 'Painting', hobbyImage: 'painting.jpg' },
  { hobbyName: 'Gaming', hobbyImage: 'gaming.jpg' }
];

// Controller to get the list of pre-built hobbies
router.get('/',(req, res) => {
  try {
    // Return the pre-built hobbies to the frontend
    res.status(200).json({ hobbies: preBuiltHobbies });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Controller to add a pre-built hobby to the authenticated user's hobbies
router.post('/insert', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from token
    const { hobbyName } = req.body; // Get hobbyName from request body

    // Validate if hobbyName is provided
    if (!hobbyName) {
      return res.status(400).json({ message: 'Hobby name is required' });
    }

    // Check if the selected hobby exists in the pre-built list
    const selectedHobby = preBuiltHobbies.find(hobby => hobby.hobbyName === hobbyName);

    if (!selectedHobby) {
      return res.status(404).json({ message: 'Hobby not found in pre-built list' });
    }

    // Check if the user already has this hobby to avoid duplicates
    const existingHobby = await Hobby.findOne({ where: { hobbyName: selectedHobby.hobbyName, userId } });

    if (existingHobby) {
      return res.status(400).json({ message: 'User already has this hobby' });
    }

    // Add the selected pre-built hobby to the user's hobbies
    const newHobby = await Hobby.create({
      hobbyName: selectedHobby.hobbyName,
      hobbyImage: selectedHobby.hobbyImage,
      userId
    });

    res.status(201).json({ message: 'Hobby added successfully', hobby: newHobby });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Controller to create a new hobby for the authenticated user
router.post('/create', async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from token
    const { hobbyName, hobbyImage } = req.body;

    // Validate if hobbyName is provided
    if (!hobbyName) {
      return res.status(400).json({ message: 'Hobby name is required' });
    }

    // Create a new hobby associated with the user
    const newHobby = await Hobby.create({
      hobbyName,
      hobbyImage,
      userId
    });

    res.status(201).json({ message: 'Hobby created successfully', hobby: newHobby });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Controller to get all hobbies for the authenticated user
router.get('/userHobby', async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from token

    // Fetch all hobbies for the authenticated user
    const hobbies = await Hobby.findAll({ where: { userId } });

    if (hobbies.length === 0) {
      return res.status(404).json({ message: 'No hobbies found for this user' });
    }

    res.status(200).json({ hobbies });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Controller to delete a hobby for the authenticated user
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from token
    const { hobbyName } = req.body; // Get hobbyName from request body

    if (!hobbyName) {
      return res.status(400).json({ message: 'Hobby name is required' });
    }

    // Find the hobby by name and ensure it belongs to the authenticated user
    const hobby = await Hobby.findOne({ where: { hobbyName, userId } });

    if (!hobby) {
      return res.status(404).json({ message: 'Hobby not found' });
    }

    // Delete the hobby
    await hobby.destroy();

    res.status(200).json({ message: 'Hobby deleted successfully' });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;