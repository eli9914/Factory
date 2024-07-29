// actionCheckMiddleware.js
const jwt = require('jsonwebtoken')
const userSessionService = require('../Services/UserSessionService')
const SECRET_KEY = 'nodeproj'

// Middleware function to check the user's remaining actions
const actionCheckMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1]

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, SECRET_KEY)

    // Decrement the user's remaining actions and retrieve the updated count
    const remainingActions = await userSessionService.decrementActions(
      decoded.userid
    )
    if (remainingActions === 0) {
      return res.status(403).json({
        error:
          'Action limit reached. You have been logged out. Please log in later.',
      })
    }
    console.log(
      `Remaining actions for user ${decoded.userid}: ${remainingActions}`
    )

    next()
  } catch (error) {
    console.error('Error in actionCheckMiddleware:', error)
    return res.status(403).json({ error: error.message })
  }
}

module.exports = actionCheckMiddleware
