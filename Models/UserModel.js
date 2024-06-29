const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: String,
  userid: Number,
  Max_Actions: Number,
})

const UserModel = mongoose.model('User', UserSchema, 'Users')

module.exports = UserModel
