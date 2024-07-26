const jwt = require('jsonwebtoken')
const SECRET_KEY = 'nodeproj'

const authenticateJWT = (req, res, next) => {
  // Extract token from the Authorization header
  const authHeader = req.headers.authorization
  if (authHeader) {
    // The token is expected to be in the format 'Bearer <token>'
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' }) // Forbidden
      }
      req.user = user
      next()
    })
  } else {
    res.status(401).json({ error: 'Unauthorized: No token provided' }) // Unauthorized
  }
}

module.exports = authenticateJWT
