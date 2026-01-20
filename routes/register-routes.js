const express = require('express');
const registerRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client.js');







module.exports = registerRouter;