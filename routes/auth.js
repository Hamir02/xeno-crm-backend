const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// ✅ Google OAuth Login Route
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential' });
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`);
    const { name, email, picture } = response.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: 'GOOGLE_AUTH' });
    }

    console.log('✅ Verified Google User:', { name, email });

    return res.status(200).json({
      message: 'Google login successful',
      user: { name, email, picture },
    });
  } catch (error) {
    console.error('❌ Google token verification failed:', error?.response?.data || error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ✅ Manual Signup Route
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
    console.error('❌ Signup error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
