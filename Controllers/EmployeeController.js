const EmployeeService = require('../Services/EmployeeService')

const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.json(await EmployeeService.getAllEmployees())
})

router.get('/:id', async (req, res) => {
  return res.json(await EmployeeService.getEmpById(req.params.id))
})
router.get('/department/:depid', async (req, res) => {
  return res.json(await EmployeeService.getEmpByDepId(req.params.depid))
})

router.put('/:id', async (req, res) => {
  const Updateduser = req.body
  const id = req.params.id
  const status = await EmployeeService.EditEmployee(id, Updateduser)
  return res.json(status)
})

router.get('/:id/shifts', async (req, res) => {
  return res.json(await EmployeeService.getShiftByEmp(req.params.id))
})
router.get('/:id/department', async (req, res) => {
  return res.json(await EmployeeService.getDepNameOfEmp(req.params.id))
})
router.post('/', async (req, res) => {
  const emp = req.body
  const status = await EmployeeService.AddEmployee(emp)
  return res.json(status)
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const status = await EmployeeService.DeleteEmployee(id)
  return res.json(status)
})
module.exports = router
