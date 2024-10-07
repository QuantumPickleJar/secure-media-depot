// models/fileModel.js
const db = require('../database/db');

const File = {};

/**
 * Creates a new file record.
 */
File.create = (fileData) => {
  const {
    file_name,
    original_name,
    uploader,
    upload_date,
    file_path,
    is_streamable,
  } = fileData;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO files (file_name, original_name, uploader, upload_date, file_path, is_streamable) VALUES (?, ?, ?, ?, ?, ?)`,
      [file_name, original_name, uploader, upload_date, file_path, is_streamable],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...fileData });
        }
      }
    );
  });
};

/**
 * Finds a file by ID.
 */
File.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
};

/**
 * Searches files by keyword.
 */
File.search = (keyword) => {
  return new Promise((resolve, reject) => {
    const query = `%${keyword}%`;
    db.all(
      `SELECT * FROM files WHERE original_name LIKE ?`,
      [query],
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      }
    );
  });
};


/**
 * Retrieves all files from the database.
 *
 * @returns {Promise<Array>} An array of file objects.
 */
File.getAll = () => {
  return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM files`, [], (err, rows) => {
          if (err) {
              reject(err);
          } else {
              resolve(rows);
          }
      });
  });
};

module.exports = File;
