const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


/**
 * Route for user login.
 * @name router.post/login
 * @function
 * @memberof authController
 * @param {string} path - The URL path for the route.
 * @param {function} middleware - The middleware function to be executed for the route.
 */
router.post('/login', authController.loginUser);

/**
 * Route for user logout.
 * @name router.post/logout
 * @function
 * @memberof authController
 * @param {string} path - The URL path for the route.
 * @param {function} middleware - The middleware function to be executed for the route.
 */
router.post('/logout', authController.logoutUsert);

// Additional router.post statements can be added here with corresponding docstring comments.