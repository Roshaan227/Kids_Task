const { Family, User, Parent } = require('../models');

const checkIfParent = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get user ID from the authenticated token

    // Fetch the parent record to check if the user is a parent and retrieve the familyId
    const parent = await Parent.findOne({ where: { userId } });

    // If the user is not a parent or doesn't have a family, return an unauthorized response
    if (!parent || !parent.familyId) {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    // Attach the familyId to the request object so it can be used in the next middleware or route handler
    req.familyId = parent.familyId;

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = checkIfParent;
