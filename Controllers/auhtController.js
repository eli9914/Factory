const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'nodeproj'

const userService = require('../Services/UserService')
const WebServiceRepo = require('../Repositories/LoginRepo')

router.get('/name', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.verify(token, SECRET_KEY)
  const username = await userService.getUserName(decoded.userid)
  return res.json(username)
})

router.post('/login', async (req, res) => {
  const userid = req.body.userid
  const username = req.body.username
  const email = req.body.email
  try {
    const Dbuser = await userService.getUserByuserid(userid)
    const Webuser = await WebServiceRepo.getUserByid(userid)
    if (Webuser == null || Dbuser == null) {
      return res.json({ error: 'user not exists' })
    }
    if (!Webuser || !Dbuser) {
      return res.json({ error: 'user not exists' })
    }
    if (!username || !email) {
      return res.json({ error: 'email and username required' })
    }
    if (
      Dbuser.userid === Webuser.id &&
      username === Webuser.username &&
      email === Webuser.email
    ) {
      const token = jwt.sign({ userid: Dbuser.userid }, SECRET_KEY, {
        expiresIn: '1h',
      })
      return res.json({ success: true, token })
    }
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
