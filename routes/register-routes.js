const express = require('express');
const registerRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client.js');

// POST /api/register
registerRouter.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }, // stored in user_metadata
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});




module.exports = registerRouter;