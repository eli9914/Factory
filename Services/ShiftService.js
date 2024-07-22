const ShiftModel = require('../Models/ShiftModel')
const EmployeeModel = require('../Models/EmployeModel')
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

const DeleteShift = async (id) => {
  try {
    await ShiftModel.findByIdAndDelete(id)
    return 'Shift Deleted'
  } catch (error) {
    console.error('Error Deleting Shift:', error)
    throw new Error('Failed to Delete Shift')
  }
}

const AddEmpToShift = async (id, EmployeesId) => {
  try {
    await ShiftModel.findByIdAndUpdate(
      shiftId,
      { $addToSet: { employees: { $each: employeeIds } } }, // Ensure unique employees
      { new: true }
    )
    return 'Employees Added to Shift'
  } catch (error) {
    console.error('Error Adding Employees to Shift:', error)
    throw new Error('Failed to Add Employees to Shift')
  }
}

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
  AddEmpToShift,
  EmployeesOfShift,
  DeleteShift,
}
