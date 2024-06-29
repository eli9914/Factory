const ShiftService = require('../Services/ShiftService')

const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.json(await ShiftService.getAllShifts())
})

router.get('/:Sid', async (req, res) => {
  return res.json(await ShiftService.EmployeesOfShift(req.params.Sid))
})

module.exports = router
