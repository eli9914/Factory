const userModel = require('../Models/UserModel')

const getAllusers = async () => {
  try {
    const users = await userModel.find({})
    return users
  } catch (error) {
    console.error('Error in getAllusers:', error)
    throw error
  }
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

const getUserName = async (userid) => {
  try {
    const user = await getUserByuserid(userid)
    return user.name
  } catch (error) {
    console.error('Error in getUserName:', error)
    throw error
  }
}

module.exports = { getUserByuserid, getAllusers, getUserName }
