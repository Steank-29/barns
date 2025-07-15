const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/config');

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    // Compare passwords directly (no hashing)
    if (password !== existingUser.password) {
      return res.status(400).json({ message: "Invalid Password." });
    }

    // Create token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

