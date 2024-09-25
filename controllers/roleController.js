const express = require('express');
const { Parent, Child, Family, User,Hobby } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');
const checkIfParent = require('../middleware/checkParent');

const router = express.Router();

// Function to calculate age from Date of Birth
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Controller to add user as a parent
router.post('/parent', async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if the user is already a parent
    const existingParent = await Parent.findOne({ where: { userId } });
    if (existingParent) {
      return res.status(400).json({ message: "User is already added as a parent" });
    }

    // Find the user's associated family
    const user = await User.findByPk(userId, { include: Family });
    if (!user || !user.Family) {
      return res.status(404).json({ message: "User is not part of any family" });
    }

    const familyId = user.Family.id;  // Automatically get the familyId from the user's family
    const familyName = user.Family.familyName;  // Get the family name

    // Extract the new fields (gender, avatar) from the request body
    const { gender, avatar } = req.body;

    // Validate the presence of gender (assuming it's required)
    if (!gender || !avatar) {
      return res.status(400).json({ message: "Gender and avatar are required" });
    }

    // Add user as a parent with the new fields
    await Parent.create({
      userId,
      familyId,
      familyName,
      gender,  // Store the gender
      avatar  // Store the avatar
    });

    res.status(200).json({ message: "User added as a parent to the family" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Controller to add user as a child and calculate the current age based on DOB
router.post('/child', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Extract the child's DOB, avatar, and gender from the request body
    const { childrenDOB, avatar, gender } = req.body;

    // Validate if DOB is provided
    if (!childrenDOB) {
      return res.status(400).json({ message: "Date of Birth is required" });
    }

    // Find the user's associated family
    const user = await User.findByPk(userId, { include: Family });
    if (!user || !user.Family) {
      return res.status(404).json({ message: "User is not part of any family" });
    }

    const familyId = user.Family.id;  // Automatically get the familyId from the user's family

    // Calculate the child's age
    const age = calculateAge(new Date(childrenDOB));  // Convert childrenDOB to a Date object

    // Add user as a child with additional fields
    await Child.create({
      userId,
      familyId,
      childrenDOB,
      avatar,
      gender
    });

    res.status(200).json({ message: "User added as a child to the family", age });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get details and hobbies of all children in the parent's family
router.get('/details', checkIfParent ,async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user._id;

    // Check if the user is a parent and retrieve their familyId
    const parent = await Parent.findOne({ where: { userId }, include: Family });
    if (!parent) {
      return res.status(404).json({ message: "User is not a parent or not associated with any family" });
    }

    const familyId = parent.familyId;

    // Fetch all children (users) associated with the same family and their hobbies
    const children = await User.findAll({
      where: { familyId }, // Find children by familyId (linked to the parent's family)
      include: [
        {
          model: Hobby,  // Include hobbies related to the children
          as: 'hobbies',  // Use the alias 'hobbies' as per your model
        }
      ]
    });

    // If no children are found
    if (children.length === 0) {
      return res.status(404).json({ message: "No children found in this family" });
    }

    // Construct response to include children's details and hobbies
    const childrenDetails = children.map(child => ({
      Member: child.id,
      name: child.fullname,
      email: child.email,
      hobbies: child.hobbies.map(hobby => hobby.hobbyName)  // Assuming Hobby has a 'hobbyName' field
    }));

    // Return the details in the response, limited to the user's family
    res.status(200).json({ familyId, children: childrenDetails });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put('/update/:familyId',  checkIfParent , async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const { familyName, familyCode } = req.body;

    // Find the family to be updated
    const family = await Family.findByPk(familyId);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    // Check if the new family code is already taken
    if (familyCode) {
      const existingFamily = await Family.findOne({ where: { familyCode: familyCode.toUpperCase() } });
      if (existingFamily && existingFamily.id !== familyId) {
        return res.status(400).json({ message: "Family code already taken. Please choose a different code." });
      }
    }

    // Update family details
    if (familyName) {
      family.familyName = familyName.toLowerCase();
    }
    if (familyCode) {
      family.familyCode = familyCode.toUpperCase();
    }
    await family.save();

    res.status(200).json({ message: "Family updated successfully", family });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;