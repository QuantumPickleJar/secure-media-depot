const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../auth/authMiddleware');

/**
 * Route for user login.
 * @name POST /login
 * @function
 * @memberof module:userRoutes
 * @param {function} userController.logout 
 * The controller function for user logout.
 */
router.post('/login', userController.logout);

/**
 * Route for user registration.
 * @name POST /register
 * @function
 * @memberof module:userRoutes
 * @param {function} userController.registerUser 
 * The controller function for user registration.
 */
router.post('/register', userController.registerUser);

/**
 * Route for getting user profile.
 * @name POST /profile
 * @function
 * @memberof module:userRoutes
 * @param {function} authenticateJWT 
 * The middleware function for authenticating JWT.
 * @param {function} userController.getUserProfile 
 * The controller function for getting user profile.
 */
router.post('/profile', authenticateJWT, userController.getUserProfile);