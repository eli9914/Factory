const EmployeeService = require('../Services/EmployeeService')
const actionCheckMiddleware = require('../Middlwares/actionCheckMiddlware')
const express = require('express')

const router = express.Router()

// Route to get all employees
router.get('/', async (req, res) => {
  return res.json(await EmployeeService.getAllEmployees())
})

// Route to get a specific employee by ID
router.get('/:id', async (req, res) => {
  return res.json(await EmployeeService.getEmpById(req.params.id))
})

// Route to get employees by department ID
router.get('/department/:depid', async (req, res) => {
  return res.json(await EmployeeService.getEmpByDepId(req.params.depid))
})

// Route to update a specific employee by ID, requires action check
router.put('/:id', actionCheckMiddleware, async (req, res) => {
  const Updateduser = req.body
  const id = req.params.id
  const status = await EmployeeService.EditEmployee(id, Updateduser)
  return res.json(status)
})

// Route to get shifts assigned to a specific employee
router.get('/:id/shifts', async (req, res) => {
  return res.json(await EmployeeService.getShiftByEmp(req.params.id))
})

// Route to get the department name of a specific employee
router.get('/:id/department', async (req, res) => {
  return res.json(await EmployeeService.getDepNameOfEmp(req.params.id))
})

// Route to add a new employee, requires action check
router.post('/', actionCheckMiddleware, async (req, res) => {
  const emp = req.body
  const status = await EmployeeService.AddEmployee(emp)
  return res.json(status)
})

// Route to delete a specific employee by ID, requires action check
router.delete('/:id', actionCheckMiddleware, async (req, res) => {
  const id = req.params.id
  const status = await EmployeeService.DeleteEmployee(id)
  return res.json(status)
})
module.exports = router
