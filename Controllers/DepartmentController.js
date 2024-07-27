const DepService = require('../Services/DepartmentService')
const actionCheckMiddleware = require('../Middlwares/actionCheckMiddlware')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.json(await DepService.getAllDepartments())
})

router.get('/:id', async (req, res) => {
  return res.json(await DepService.getDepById(req.params.id))
})

router.put('/:id', actionCheckMiddleware, async (req, res) => {
  const updatedDep = req.body
  const depId = req.params.id
  const status = await DepService.EditDep(depId, updatedDep)
  return res.json(status)
})

router.post('/', actionCheckMiddleware, async (req, res) => {
  const dep = req.body
  const status = await DepService.AddDep(dep)
  return res.json(status)
})

router.delete('/:id', actionCheckMiddleware, async (req, res) => {
  const depId = req.params.id
  const status = await DepService.DeleteDep(depId)
  return res.json(status)
})

module.exports = router
