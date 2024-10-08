// We'll need to import jwt to use the verify method
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check decoded. If it passes, move on.
    // Assign decoded payload to req.user
    req.user = decoded;
    // Call next() to invoke the next middleware function
    next(); 
  } catch (error) {
    // If decoded fails instead, send back a 401 status and an 'Invalid token.' error message
    res.status(401).json({ error: 'Invalid token.' });
  }
}

// We'll need to export this func
module.exports = verifyToken;