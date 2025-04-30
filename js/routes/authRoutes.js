/**
 * @module routes/authRoutes
 * handles routes for authentication (/login, /logout).
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


/**
 * Route for user login.
 * @name POST /login
 * @function
 * @memberof module:authController
 * @param {function} authController.logout 
 * The controller function for user logout.
 */
router.post('/login', authController.loginUser);

/**
 * Route for user logout.
 * @name POST /logout
 * @function
 * @memberof module:authController
 * @param {string} path - The URL path for the route.
 */
router.post('/logout', authController.logoutUser);

// Additional router.post statements can be added here with corresponding docstring comments.
module.exports = router;