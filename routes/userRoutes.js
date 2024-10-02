const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../auth/authMiddleware');
const rateLimit = require('express-rate-limit');

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,                 // 5 registration attempts per window
    message: 'Too many accounts created from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-` headers
    legacyHeaders: false, // Disable the `X-RateLimit-` headers
});

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
router.get('/profile', authenticateJWT, userController.getUserProfile);

module.exports = {
    router,
    registrationLimiter
};