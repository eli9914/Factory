const DepService = require('../Services/DepartmentService')

const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.json(await DepService.getAllDepartments())
})

module.exports = router
