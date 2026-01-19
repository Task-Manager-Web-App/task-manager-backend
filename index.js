const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());



// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});





const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});