//
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const signupHandler = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User is already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const createdUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = jwt.sign({ _id: createdUser.id, email: createdUser.email }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({
            message: "User created successfully",
            user: {
                _id: createdUser.id,
                fullname: createdUser.fullname,
                email: createdUser.email
            },
            token
        });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ _id: existingUser.id, email: existingUser.email }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: existingUser.id,
                fullname: existingUser.fullname,
                email: existingUser.email
            },
            token
        });
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
