const db = require('../database/db');
const path = require('path');
const File = require('../models/fileModel');
/**
 * Uploads a file and stores its metadata in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

exports.uploadFile = async (req, res) => {   
    console.log('Preparing to upload file...');
    // Step one is capturing the file's metadata from the request
    const fileData = {
      file_name: req.file.filename,            // req.file
      original_name: req.file.originalname,    // req.file
      uploader: req.user.username,              // req.user
      upload_date: new Date(),  // might need to handle this server-side instead?
      file_path: req.file.path,
      is_streamable: req.body.is_streamable ? 1 : 0
    };

    // now we have to handle the file's contents, which are a little trickier
    try {
      const file = await File.create(fileData);
      res.status(201).json({message: 'File uploaded successfully!', file });
    } catch {
      res.status(500).json({error: 'Internal server error'});
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
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**

exports.listFilesOld = (req, res) => {
    db.all(`SELECT id, originalname, uploader, is_streamable FROM files`, [], (err, files) => {
      if (err) {
        return res.status(500).send('Error retrieving files');
      }
      res.json(files);
    });

    // TODO: come back and revise this, hook into for IsStreamable
    const streamFile = file.is_streamable ? 'inline' : 'attachment';
    res.setHeader('Content-Disposition', `${streamFile}; filename="${file.originalname}"`);
    res.sendFile(path.resolve(file.filepath));
};

/**
 * Generates a list of matching files based on a supplied {keyword}
 * @param {Object} req - The request object, contains the keyword
 * @param {Object} res - The response object.
 */
exports.searchFiles = async (req, res) => {
  // users will enter a search keyword, we must pull it from the request
  const { keyword } = req.query;
  try {
    // try to search the Api Service by instructing fileController
    const files = await File.search(keyword);
    res.json(files);
  } catch {
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
<<<<<<< Updated upstream
    const file = File.findById(req.params.id);
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
          'Content-Type': 'video/mp4', // Adjust as needed
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
  } catch (err) {

  }
}