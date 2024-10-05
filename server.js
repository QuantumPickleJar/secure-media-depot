// server.js
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors());

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                 // 5 registration attempts per window
  message: 'Too many accounts created from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-` headers
  legacyHeaders: false, // Disable the `X-RateLimit-` headers
});

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// to use a rate limiter, we leverage the constructor for the Router
const { router: userRoutes, registrationLimiter} = require('./routes/userRoutes');

app.use('/',authRoutes);
app.use('/',fileRoutes);
app.use('/api/users/register', registrationLimiter, userRoutes);

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