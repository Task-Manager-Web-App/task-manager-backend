const express = require('express');
const loginRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client.js');


// POST -login
loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});




module.exports = loginRouter;