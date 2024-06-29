const ShiftModel = require('../Models/ShiftModel')
const EmployeeService = require('../Services/EmployeeService')

const getAllShifts = async () => {
  return await ShiftModel.find({})
}

const getShiftById = async (id) => {
  return await ShiftModel.findById(id)
}

const EditShift = async (id, updatedshift) => {
  try {
    await ShiftModel.findByIdAndUpdate(id, updatedshift)
    return 'Shift Updated '
  } catch (error) {
    console.error('Error Updating Shift:', error)
    throw new Error('Failed to Update Shift')
  }
}
const DeleteShift = async (id) => {
  try {
    await ShiftModel.findByIdAndDelete(id)
    return 'Shift Deleted'
  } catch (error) {
    console.error('Error Deleting Shift:', error)
    throw new Error('Failed to Delete Shift')
  }
}
const EmployeesOfShift = async (id) => {
  const shift = await getShiftById(id)
  const EmployeesOfShift = shift.employees

  // Create an array of promises for fetching employees
  const employeePromises = EmployeesOfShift.map(async (Emp) => {
    return await EmployeeService.getEmpById(Emp)
  })

  // Wait for all promises to resolve
  const EmpList = await Promise.all(employeePromises)

  return EmpList
}

module.exports = {
  getAllShifts,
  getShiftById,
  EditShift,
  DeleteShift,
  EmployeesOfShift,
}
