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

module.exports = authenticateJWT;