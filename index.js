const express = require('express');
const http = require('http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);

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

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});