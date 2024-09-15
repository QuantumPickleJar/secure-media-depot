// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database/db');

app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/',authRoutes);
app.use('/',fileRoutes);
app.use('/',userRoutes);

app.use(express.static('public'));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});