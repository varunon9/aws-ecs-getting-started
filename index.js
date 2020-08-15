const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ECE AWS Getting Started Successful'
  });
});

app.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'pong'
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});