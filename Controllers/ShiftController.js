const ShiftService = require('../Services/ShiftService')
const actionCheckMiddleware = require('../Middlwares/actionCheckMiddlware')
const express = require('express')

const router = express.Router()

// Route to get all shifts
router.get('/', async (req, res) => {
  return res.json(await ShiftService.getAllShifts())
})

// Route to get a specific shift by ID
router.get('/:Sid', async (req, res) => {
  return res.json(await ShiftService.getShiftById(req.params.Sid))
})

// Route to get employees assigned to a specific shift
router.get('/:Sid/employees', async (req, res) => {
  return res.json(await ShiftService.EmployeesOfShift(req.params.Sid))
})

// Route to update a specific shift by ID, requires action check
router.put('/:Sid', actionCheckMiddleware, async (req, res) => {
  const UpdatedShift = req.body
  const Sid = req.params.Sid
  const status = await ShiftService.EditShift(Sid, UpdatedShift)
  return res.json(status)
})

// Route to create a new shift, requires action check
router.post('/', actionCheckMiddleware, async (req, res) => {
  const shiftData = req.body
  const status = await ShiftService.AddShift(shiftData)
  return res.json(status)
})

module.exports = router
