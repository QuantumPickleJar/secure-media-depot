// server.js
const express = require('express');
const app = express();
const cors = require('cors');
// const sqlite3 = require('sqlite3').verbose();
const db = require('./database/db');
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.use('/',authRoutes);
app.use('/',fileRoutes);

app.use(express.static('public'));



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});