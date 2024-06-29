const axios = require('axios')

const url = 'https://jsonplaceholder.typicode.com/users'

const getUsersList = async () => {
  try {
    const { data: usersList } = await axios.get(url)
    const users = usersList.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }))
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

const getUserByid = async (id) => {
  const { data: user } = await axios.get(url + `/${id}`)
  return user
}
module.exports = { getUsersList, getUserByid }
