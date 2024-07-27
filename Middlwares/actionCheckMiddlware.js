// actionCheckMiddleware.js
const jwt = require('jsonwebtoken')
const userSessionService = require('../Services/UserSessionService')
const SECRET_KEY = 'nodeproj'

const actionCheckMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, SECRET_KEY)

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
