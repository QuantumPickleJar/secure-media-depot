const sqlite3 = require('sqlite3').verbose();

/**
 * Represents a database connection.
 * @class
 */
// const db = new sqlite3.Database('./media.db', (err) => {
const db = new sqlite3.Database(
    path.resolve(__dirname, '../media.db'), (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create tables for users and files

/**
 * Creates the 'users' and 'files' tables if they don't exist.
 * @function
 */
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT,
            original_name TEXT,
            uploader TEXT,
            upload_date DATETIME,
            file_path TEXT,
            is_streamable INTEGER
        )
    `);
});

module.exports = db;
