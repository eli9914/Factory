const UserSessionModel = require('../Models/UserSessionModel')

// Function to get a user session by user ID
const getUserSessionByuserid = async (userid) => {
  try {
    const userSession = await UserSessionModel.findOne({ userid })
    return userSession
  } catch (error) {
    console.error('Error in getUserSessionByuserid:', error)
    throw error
  }
}

// Function to create a new user session
const createUserSession = async (userid, maxActions) => {
  try {
    const userSession = await getUserSessionByuserid(userid)
    if (userSession) {
      return 'User session already exists'
    } else {
      const userSession = new UserSessionModel({
        userid,
        maxActions,
        initialMaxActions: maxActions,
        actionResetTime: new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hours Lock
      })
      await userSession.save()
      return 'User Session Created'
    }
  } catch (error) {
    console.log('Error in createUserSession')
    throw error
  }
}

// Function to decrement the number of actions for a user session
const decrementActions = async (userid) => {
  try {
    let userSession = await getUserSessionByuserid(userid)
    if (!userSession) {
      throw new Error('User session not found')
    }

    if (userSession.actionResetTime < new Date()) {
      userSession.maxActions = userSession.initialMaxActions
      userSession.actionResetTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

    if (userSession.maxActions > 0) {
      userSession.maxActions -= 1
      await userSession.save()
    }
    return userSession.maxActions
  } catch (error) {
    console.error('Error in decrementActions:', error)
    throw error
  }
}
module.exports = { getUserSessionByuserid, createUserSession, decrementActions }
