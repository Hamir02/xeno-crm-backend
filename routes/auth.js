const express = require('express');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client();

// =============================
// ✅ Google OAuth Login Route
// =============================
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // ✅ Check if user exists or create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: 'GOOGLE_AUTH' }); // Placeholder
    }

    console.log('✅ Verified Google User:', { name, email });

    return res.status(200).json({
      message: 'Google login successful',
      user: { name, email, picture },
    });

  } catch (error) {
    console.error('❌ Google token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// =============================
// ✅ Manual Signup Route
// =============================
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
