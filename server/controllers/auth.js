const Userdb = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Userdb.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Adresse email invalide.' });
    }

    // Plaintext password comparison (⚠️ not secure for production)
    if (user.password == password) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Generate access token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    // Optional: Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret'
    );

    // Send back user and tokens
    res.status(200).json({ user, token, refreshToken });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};
