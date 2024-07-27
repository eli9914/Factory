const mongoose = require('mongoose')

const UserSessionSchema = mongoose.Schema({
  userid: Number,
  maxActions: Number,
  initialMaxActions: Number,
  actionResetTime: Date,
})

const UserSessionModel = mongoose.model(
  'UserSession',
  UserSessionSchema,
  'UserSessions'
)

module.exports = UserSessionModel
