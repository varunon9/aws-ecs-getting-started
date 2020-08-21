const express = require('express');

const port = process.env.PORT || 4000;
const app = express();
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
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