const express = require('express');
const registerRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client');

// POST /api/register
registerRouter.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({
      message: 'Registration successful. Check email for confirmation.',
      user: data.user,
      session: data.session
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = registerRouter;
