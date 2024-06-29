const userModel = require('../Models/UserModel')

const getAllusers = async () => {
  const users = await userModel.find({})
  console.log(users)
  return users
}

const getUserByuserid = async (userid) => {
  try {
    const user = await userModel.findOne({ userid: userid }) // Query by 'userid' field
    return user // Return the whole user object
  } catch (error) {
    console.error('Error in getUserByuserid:', error)
    throw error
  }
}

module.exports = { getUserByuserid, getAllusers }
