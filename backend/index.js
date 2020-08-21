const express = require('express');

const port = process.env.PORT || 3000;
const app = express();
const api = express();

api.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend successfully started: call /api/users & /api/admins to get Data'
  });
});

// Test API for frontend microservice
api.get('/users', (req, res) => {
  res.json({
    success: true,
    data: [
      'Aditi Laturkar', 
      'Anmol Horo', 
      'Darshita Golchha', 
      'Snigdha Rani Mishra', 
      'Varun Kumar'
    ]
  });
});

// Test API for admin-panel microservice
api.get('/admins', (req, res) => {
  res.json({
    success: true,
    data: [
      'Keshav Agrawal', 
      'Om Thapa',
    ]
  });
});

// health check url
api.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'pong'
  });
});

app.use('/api', api); // Mounting api app on /api path

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});