const express = require('express');
const logoutRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client.js');

// POST /logout
logoutRouter.post('/', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = logoutRouter;
