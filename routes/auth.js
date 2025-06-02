// You already pasted this — ✅ GOOD CODE
const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

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