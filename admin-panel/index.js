const express = require('express');

const port = process.env.PORT || 5000;
const app = express();
const admin = express();
const path = require('path');

admin.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// health check url
admin.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'pong'
  });
});

app.use('/admin', admin); // Mounting admin app on /admin path

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});