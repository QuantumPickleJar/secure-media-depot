// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database/db');
require('dotenv').config();
app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/',authRoutes);
app.use('/',fileRoutes);
app.use('/',userRoutes);

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