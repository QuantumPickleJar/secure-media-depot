// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cors());

// Database initialization
const db = new sqlite3.Database('./media.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

exports.db = db;

/**
 * Registering a new user will store their credentials inside the SQLite database
 */
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
    if (err) {
      return res.status(400).send('Username already exists.');
    }
    res.status(201).send('User registered successfully');
  });
});

