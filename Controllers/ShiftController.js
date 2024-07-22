const ShiftService = require('../Services/ShiftService')

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

router.post('/', async (req, res) => {
  const shiftData = req.body
  const status = ShiftService.AddShift(shiftData)
  return res.json(status)
})

router.post('/:Sid/employees', async (req, res) => {
  const shiftId = req.params.Sid
  const employeeIds = req.body.employeeIds
  const status = await ShiftService.AddEmpToShift(shiftId, employeeIds)
  return res.json(status)
})

module.exports = router
