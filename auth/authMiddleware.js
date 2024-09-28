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

const authorizeAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // extract the token from the header
        const token = authHeader.split(' ')[1];

        // figure out where the user can go, based on their token
        try {
            const user = jwtService.verifyToken(token);
            if (user.isAdmin) {
                req.user = user;
                next();
            } else {
                res.status(403).send('Access denied: you are not an admin');
            }
        } catch (err) {
            res.status(403).send('Invalid token');
        }
    } else {
        res.status(403).send('No token provided');
    }
}

module.exports = authenticateJWT, authorizeAdmin;