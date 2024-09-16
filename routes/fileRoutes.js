// routes/fileRoutes.js

/**
 * Express router for handling file routes.
 * @module routes/fileRoutes
 */

const express = require('express');
const router = express.Router();
const authenticateJWT = require('../auth/authMiddleware');
const fileController = require('../controllers/fileController');
const upload = require('../config/multer');

/**
 * Route for uploading a file.
 * @name POST /upload
 * @function
 * @memberof module:routes/fileRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @param {callback} controller - Controller function for handling the file upload
 */
router.post('/upload', authenticateJWT, upload.single('file'), fileController.uploadFile);

/**
 * Route for listing all files.
 * @name GET /files
 * @function
 * @memberof module:routes/fileRoutes
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @param {callback} controller - Controller function for listing all files
 */
router.get('/files', authenticateJWT, fileController.listFiles);

/**
 * Route for getting a file by ID.
 * @name GET /files/:id
 * @function
 * @memberof module:routes/fileRoutes
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @param {callback} controller - Controller function for getting a file by ID
 */
router.get('/files/:id', authenticateJWT, fileController.getFileById);

router.get('/files/search', authenticateJWT, fileController.searchFiles)

module.exports = router;
