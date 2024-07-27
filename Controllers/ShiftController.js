const ShiftService = require('../Services/ShiftService')
const actionCheckMiddleware = require('../Middlwares/actionCheckMiddlware')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.json(await ShiftService.getAllShifts())
})

router.get('/:Sid', async (req, res) => {
  return res.json(await ShiftService.getShiftById(req.params.Sid))
})

router.get('/:Sid/employees', async (req, res) => {
  return res.json(await ShiftService.EmployeesOfShift(req.params.Sid))
})

router.put('/:Sid', actionCheckMiddleware, async (req, res) => {
  const UpdatedShift = req.body
  const Sid = req.params.Sid
  const status = await ShiftService.EditShift(Sid, UpdatedShift)
  return res.json(status)
})

router.post('/', actionCheckMiddleware, async (req, res) => {
  const shiftData = req.body
  const status = await ShiftService.AddShift(shiftData)
  return res.json(status)
})

module.exports = router
