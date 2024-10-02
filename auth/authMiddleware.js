const jwtService = require('../services/jwtService');

/**
 * Require a JWT in order to verify the user's credentials
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

   try {
      const user = jwtService.verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
        return res.sendStatus(403); // invalid token
    }
  } else {
    res.sendStatus(401); // No token provided
  }
};

/**
 * Middleware to authorize admin users.
 *
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next -  next middleware function.
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user && user.isAdmin) {
        // req.user = user;
        next();
    } else {
        res.status(403).send('Access denied: admin access only');
    }
}

module.exports = { authenticateJWT, authorizeAdmin };