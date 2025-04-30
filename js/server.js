// server.js
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// to use a rate limiter, we leverage the constructor for the Router
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth',authRoutes);
app.use('/api/files',fileRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/users/register', registrationLimiter, userRoutes);

// app.use(express.static('public'));

// serve static files from our React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// unrecognized route handler:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});