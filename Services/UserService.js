const userModel = require('../Models/UserModel')

//Function to Get All Users
const getAllusers = async () => {
  try {
    const users = await userModel.find({})
    return users
  } catch (error) {
    console.error('Error in getAllusers:', error)
    throw error
  }
}

// Function to get a user by his user ID
const getUserByuserid = async (userid) => {
  try {
    const user = await userModel.findOne({ userid: userid })
    return user
  } catch (error) {
    console.error('Error in getUserByuserid:', error)
    throw error
  }
}

// Function to get the name of a user by his user ID
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
