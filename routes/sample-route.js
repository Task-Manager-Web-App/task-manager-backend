//Supabase integrated sample route to fetch data from sample_tasks table

const express = require('express');
const sampleTasksRouter = express.Router();

//I applied this in index.js:
require('dotenv').config();
const { supabase } = require('../supabase-client.js');

sampleTasksRouter.get('/', async (req, res) => {

    try {
        
        const { data, error } = await supabase
            .from('sample_tasks')
            .select('*');   
        
        if (error) {
            res.status(500).json({ error: error.message });
        }   
        else{
            res.status(200).json(data);
        }
        
    } 
    
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});










module.exports = sampleTasksRouter;


