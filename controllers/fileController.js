const db = require('../database/db');
const path = require('path');

/**
 * Uploads a file and stores its metadata in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.uploadFile = (req, res) => {
    // find out if the file is one that can be streamed
    const isStreamable = req.body.isStreamable || 0;
    db.run(
        `INSERT INTO files (file_name, original_name, uploader, upload_date, filepath, is_streamable)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [req.file_name, req.original_name, req.uploader, req.upload_date, req.file.path, isSatreamable],
        (err) => {
            if (err) {
              return res.status(500).send('Error storing file metadata');
            }
            res.status(201).send('File uploaded successfully');
          }
    );
};

/**
 * Retrieves a list of files from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.listFiles = (req, res) => {
    db.all(`SELECT id, originalname, uploader, is_streamable FROM files`, [], (err, files) => {
      if (err) {
        return res.status(500).send('Error retrieving files');
      }
      res.json(files);
    });
};