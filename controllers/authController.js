const express = require('express');
const { User,Family } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const authenticateToken = require('../middleware/authenticateToken.js'); // Token authentication middleware

// Use dotenv to load environment variables
require('dotenv').config();

// Initialize Router
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Log incoming data
        console.log("Signup request data:", { fullname, email, password });

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User is already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);

        // Create new user
        const createdUser = await User.create({
            fullname,
            email: email.toLowerCase(), // Store email in lowercase to avoid case issues
            password: hashedPassword
        });
        console.log("Created User:", createdUser);

        // Generate token
        const token = jwt.sign({ _id: createdUser.id, email: createdUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: "User created successfully",
            user: {
                _id: createdUser.id,
                fullname: createdUser.fullname,
                email: createdUser.email,
                token
            } 
        });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the request body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Normalize email to lower case
        const normalizedEmail = email.toLowerCase();

        // Check if user exists (include paranoid: false to find soft-deleted users)
        const existingUser = await User.findOne({ 
            where: { email: normalizedEmail }, 
            paranoid: false 
        });

        if (!existingUser) {
            console.log("User not found in database for email:", normalizedEmail);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the user is soft-deleted
        if (existingUser.deletedAt) {
            return res.status(400).json({ message: "User account is deleted" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        if (!process.env.JWT_SECRET_KEY) {
            console.error("JWT secret key is not defined in environment variables.");
            return res.status(500).json({ message: "Internal Server Error" });
        }

        const token = jwt.sign({ 
            _id: existingUser.id, 
            email: existingUser.email 
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Check if the user has a family
        let family = null;
        if (existingUser.familyId) {
            family = await Family.findByPk(existingUser.familyId);
            if (!family) {
                console.error("Family not found for user:", existingUser.familyId);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: existingUser.id,
                fullname: existingUser.fullname,
                email: existingUser.email
            },
            token,
            family // Include family data in response if exists
        });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update User Route
// router.put('/update', authenticateToken, async (req, res) => {
//     try {
//         const { email, newFullname, newPassword } = req.body;

//         // Find the user
//         const user = await User.findOne({ where: { email: email.toLowerCase() }, paranoid: false });
//         if (!user || user.deletedAt) {
//             return res.status(404).json({ message: "User not found or deleted" });
//         }

       
//         // Update user details
//         if (newFullname) {
//             user.fullname = newFullname;
//         }
//         if (newPassword) {
//             // Hash new password
//             const hashedPassword = await bcrypt.hash(newPassword, 10);
//             user.password = hashedPassword;
//         }

//         // Save user changes
//         await user.save();

//         // If the user is part of a family, ensure the family data is updated accordingly
//         if (user.familyId) {
//             const family = await family.findByPk(user.familyId, {
//                 include: {
//                     model: User,
//                     attributes: ['id', 'fullname'] // Include relevant attributes
//                 }
//             });

//             if (!family) {
//                 return res.status(404).json({ message: "Family not found" });
//             }

//             // Optionally update family information if needed, based on user updates.
//             // You could also log these changes or notify other family members if required.

//             res.status(200).json({ 
//                 message: "User updated successfully and family data is in sync", 
//                 user,
//                 family: family.Users // Return family members' data
//             });
//         } else {
//             res.status(200).json({ message: "User updated successfully", user });
//         }
//     } catch (err) {
//         console.error("Error: ", err.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


router.put('/update', authenticateToken, async (req, res) => {
    try {
        const { email, newFullName, newPassword } = req.body;

        // Find the user
        const user = await User.findOne({ where: { email: email.toLowerCase() }, paranoid: false });
        if (!user || user.deletedAt) {
            return res.status(404).json({ message: "User not found or deleted" });
        }

        // Update user details
        if (newFullName) {
            user.fullname = newFullName;
        }
        if (newPassword) {
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        // Save user changes
        await user.save();

        // If the user is part of a family, ensure the family data is updated accordingly
        if (user.familyId) {
            const family = await Family.findByPk(user.familyId, {
                include: {
                    model: User,
                    attributes: ['id', 'fullname'] // Include relevant attributes
                }
            });

            if (!family) {
                return res.status(404).json({ message: "Family not found" });
            }

            res.status(200).json({ 
                message: "User updated successfully and family data is in sync", 
                user,
                family: family.Users // Return family members' data
            });
        } else {
            res.status(200).json({ message: "User updated successfully", user });
        }
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Delete User (Soft Delete) Route
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Soft delete the user
        await user.destroy();

        res.status(200).json({ message: "User soft deleted successfully" });
    } catch (err) {  
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Restore User Route
router.post('/restore', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the soft-deleted user (include paranoid: false to find deleted users)
        const user = await User.findOne({ where: { email: email.toLowerCase() }, paranoid: false });

        if (!user) { 
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is soft-deleted
        if (!user.deletedAt) {
            return res.status(400).json({ message: "User is not deleted" });
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Restore the user
        await user.restore();

        // Respond with success message
        res.status(200).json({ message: "User restored successfully", user: { id: user.id, email: user.email, fullname: user.fullname } });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Find Deleted Users Route
router.get('/deleted', async (req, res) => {
    try {
        // Find all soft-deleted users
        const deletedUsers = await User.findAll({ where: { deletedAt: { [Op.not]: null } }, paranoid: false });
        res.status(200).json({ deletedUsers });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
