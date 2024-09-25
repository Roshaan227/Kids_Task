const express = require('express');
const { Family, User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const { Op } = require('sequelize');

// Initialize Router
const router = express.Router();


// Controller to create a family and assign the user
router.post('/create', async (req, res) => {
    try {
        const { familyName, role, familyCode } = req.body;
        const userId = req.user._id;
        const existingUser = await User.findByPk(userId);
        if (existingUser.familyId) {
            return res.status(400).json({ message: "User is already part of a family" });
        }

        // Check if the provided family code already exists
        const existingFamily = await Family.findOne({ where: { familyCode: familyCode.toUpperCase() } });
        if (existingFamily) {
            return res.status(400).json({ message: "Family code already taken. Please choose a different code." });
        }

        // Check if the family name already exists
       

        const newFamily = await Family.create({
            familyName: familyName.toLowerCase(),
            familyCode: familyCode.toUpperCase(),
            Members: 1
        });

        existingUser.familyId = newFamily.id;
        existingUser.role = role;
        await existingUser.save();

        res.status(201).json({
            message: "Family created and user added successfully",
            family: newFamily,
            user: existingUser
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Route to join a family (unchanged)
router.post('/join', async (req, res) => {
    try {
        const { familyCode, role } = req.body;
        const userId = req.user._id;

        const user = await User.findByPk(userId);
        if (user.familyId) {
            return res.status(400).json({ message: "User is already part of a family" });
        }

        const family = await Family.findOne({ where: { familyCode } });
        if (!family) {
            return res.status(404).json({ message: "Family not found" });
        }

        user.familyId = family.id;
        user.role = role;
        await user.save();

        family.Members += 1;
        await family.save();

        res.status(200).json({
            message: "User successfully joined the family",
            user,
            family
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Route to leave/delete a family
router.post('/leave', async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the user and their family
        const user = await User.findByPk(userId);
        if (!user.familyId) {
            return res.status(400).json({ message: "User is not part of any family" });
        }

        const family = await Family.findByPk(user.familyId);
        if (!family) {
            return res.status(404).json({ message: "Family not found" });
        }

        // Decrement family members count or delete the family if it's the last member
        if (family.Members === 1) {
            // If the user is the last member, delete the family
            await family.destroy();
            res.status(200).json({ message: "Family deleted as the last member left" });
        } else {
            // If there are other members, just decrement the count and remove the user from the family
            family.Members -= 1;
            await family.save();

            // Remove user from family
            user.familyId = null;
            user.role = null; // Optionally reset the role
            await user.save();

            res.status(200).json({ message: "User successfully left the family" });
        }
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Get family details (unchanged)
router.get('/details',  async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from the token

        // Find the user along with the family they belong to and its members
        const user = await User.findByPk(userId, {
            include: {
                model: Family,
                include: {
                    model: User,  // Include all users (family members) in the family
                    attributes: ['id', 'fullname', 'email']  // Include only necessary attributes
                }
            }
        });

        // Check if the user is part of any family
        if (!user || !user.Family) {
            return res.status(404).json({ message: "User is not part of any family" });
        }

        // Return family details and its members
        res.status(200).json({
            // family: user.Family,
            members: user.Family.Users // family.Users will contain all family members
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    } 
});


module.exports = router;
