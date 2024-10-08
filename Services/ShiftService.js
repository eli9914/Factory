const ShiftModel = require('../Models/ShiftModel')
const EmployeeModel = require('../Models/EmployeModel')

// Function to get all shifts from the database
const getAllShifts = async () => {
  return await ShiftModel.find({})
}

// Function to get a shift by its id
const getShiftById = async (id) => {
  return await ShiftModel.findById(id)
}

// Function to update an existing shift by its id
const EditShift = async (id, updatedshift) => {
  try {
    await ShiftModel.findByIdAndUpdate(id, updatedshift)
    return 'Shift Updated '
  } catch (error) {
    console.error('Error Updating Shift:', error)
    throw new Error('Failed to Update Shift')
  }
}

// Function to create a new shift
const AddShift = async (shiftData) => {
  try {
    const newShift = new ShiftModel(shiftData)
    await newShift.save()
    return 'Shift Created'
  } catch (error) {
    console.log('Error Creating Shift')
    throw new Error('Failed to Create Shift')
  }
}
// Function to delete a shift by its id
const DeleteShift = async (id) => {
  try {
    await ShiftModel.findByIdAndDelete(id)
    return 'Shift Deleted'
  } catch (error) {
    console.error('Error Deleting Shift:', error)
    throw new Error('Failed to Delete Shift')
  }
}
// Function to get all employees assigned to a specific shift
const EmployeesOfShift = async (id) => {
  const shift = await getShiftById(id)
  const employeeIds = shift.employees

  const employeePromises = employeeIds.map(async (empId) => {
    return await EmployeeModel.findById(empId)
  })

  const employees = await Promise.all(employeePromises)
  return employees
}

module.exports = {
  getAllShifts,
  getShiftById,
  AddShift,
  EditShift,
  EmployeesOfShift,
  DeleteShift,
}
