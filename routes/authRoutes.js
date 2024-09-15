const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Controller for handling authentication related operations.
 * @namespace authController
 */

/**
 * Route for user registration.
 * @name router.post/register
 * @function
 * @memberof authController
 * @param {string} path - The URL path for the route.
 * @param {function} middleware - The middleware function to be executed for the route.
 */
router.post('/register', authController.register);

/**
 * Route for user login.
 * @name router.post/login
 * @function
 * @memberof authController
 * @param {string} path - The URL path for the route.
 * @param {function} middleware - The middleware function to be executed for the route.
 */
router.post('/login', authController.login);

/**
 * Route for user logout.
 * @name router.post/logout
 * @function
 * @memberof authController
 * @param {string} path - The URL path for the route.
 * @param {function} middleware - The middleware function to be executed for the route.
 */
router.post('/logout', authController.logout);

// Additional router.post statements can be added here with corresponding docstring comments.