const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());


// Importing sample route
const sampleTasksRouter = require('./routes/sample-route');
app.use('/sample-tasks', sampleTasksRouter);


// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});





const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});