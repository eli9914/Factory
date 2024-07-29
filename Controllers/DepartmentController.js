const DepService = require('../Services/DepartmentService')
const actionCheckMiddleware = require('../Middlwares/actionCheckMiddlware')
const express = require('express')

const router = express.Router()

// Route to get all departments
router.get('/', async (req, res) => {
  return res.json(await DepService.getAllDepartments())
})

// Route to get a specific department by ID
router.get('/:id', async (req, res) => {
  return res.json(await DepService.getDepById(req.params.id))
})

// Route to update a specific department by ID, requires action check
router.put('/:id', actionCheckMiddleware, async (req, res) => {
  const updatedDep = req.body
  const depId = req.params.id
  const status = await DepService.EditDep(depId, updatedDep)
  return res.json(status)
})

// Route to add a new department, requires action check
router.post('/', actionCheckMiddleware, async (req, res) => {
  const dep = req.body
  const status = await DepService.AddDep(dep)
  return res.json(status)
})

// Route to delete a specific department by ID, requires action check
router.delete('/:id', actionCheckMiddleware, async (req, res) => {
  const depId = req.params.id
  const status = await DepService.DeleteDep(depId)
  return res.json(status)
})

module.exports = router
