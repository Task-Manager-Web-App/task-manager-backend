const express = require('express');
const profileRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client.js');







module.exports = profileRouter;