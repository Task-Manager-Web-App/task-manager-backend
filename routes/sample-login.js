const express = require('express');
const sampleLoginRouter = express.Router();

require('dotenv').config();
const { supabase } = require('../supabase-client.js');




module.exports = sampleLoginRouter;
