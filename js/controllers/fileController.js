/**
 * @module controller/fileController
 * Handles serving and storage of files to logged-in users
 */
const db = require('../database/db');
const path = require('path');
const File = require('../models/fileModel');
const fs = require('fs');

/**
 * Uploads a file and stores its metadata in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.uploadFile = async (req, res) => {   
    // Step one is capturing the file's metadata from the request
    const fileData = {
      file_name: req.file.file_name,            // req.file
      original_name: req.file.original_name,    // req.file
      uploader: req.user.username,              // req.user
      upload_date: new Date(),  // might need to handle this server-side instead?
      file_path: req.file.path,                 // req.file
      is_streamable: req.body.is_streamable ? 1 : 0
    };

    // now we have to handle the file's contents, which are a little trickier
    try {
      const file = await File.create(fileData);
      res.status(201).json({message: 'File uploaded successfully!', file });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({error: 'Internal server error' });
    }
  };

/** Retrieves a list of files from the database.
  * @param {Object} req - The request object.
  * @param {Object} res - The response object.
  */
exports.listFiles = async (req, res) => {
  try {
    const files = await File.getAll();
    res.json(files);
  } catch (err) {
    console.error('Error listing files:', err);     // log error to console
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Generates a list of matching files based on a supplied {keyword}
 * @param {Object} req - The request object, contains the keyword
 * @param {Object} res - The response object.
 */
exports.searchFiles = async (req, res) => {
  // users will enter a search keyword, we must pull it from the request
  const { keyword } = req.query;
  try {
    // try to search the Api Service by invoking fileModel's search method
    const files = await File.search(keyword);
    res.json(files);
  } catch (err) {
    console.error('Error performing search:', err);     // log error to console
    res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * Called when clicking on a hyperlink to a file.
 * 
 * If the file being requested is a *video*, then it will 
 * automatically be converted to a ByteStream so that it 
 * can be played clientside in-browser (or in future versions, apps)
 * 
 * Otherwise, we just serve the file to be downloaded.
 * @param {*} req 
 * @param {*} res 
 */
exports.getFileById = async (req, res) => {
  try {
    // error out if the file can't be found 
    const file = await File.findById(req.params.id);
    if (!file) {
=======
    const file = await File.findById(req.params.id);
    
    if (!file) {                        // Make sure the file exists first
>>>>>>> Stashed changes
      return res.status(404).json({error: 'File not found'});
    }
    
    // 
    const filePath = path.resolve(file.file_path);
    
    if (file.is_streamable) {           // Stream the file if it's compatible
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      // if the file is valid, we'll need to funnel its bytes to the client
      if (range) { 
        // parse the file's bytes and turn them into a ByteStream
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1]
        ? parseInt(parts[1], 10)
          : fileSize - 1;
        const chunksize = end - start + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });

        // now the stream is ready!
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        });
        // to send the file to the user, it's piped through an HTTP Response
        fs.createReadStream(filePath).pipe(res);
      }
    } 
    // If it's not a streamable video, then serve as download
    else {
      res.download(filePath, file.original_name, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    }
  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}