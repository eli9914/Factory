const EmployeeModel = require('../Models/EmployeModel')
const ShiftService = require('../Services/ShiftService')
const DepartmentService = require('../Services/DepartmentService')

//Function to get All Employees
const getAllEmployees = async () => {
  try {
    return await EmployeeModel.find({})
  } catch (error) {
    throw error
  }
}
// Function to get employee by his id
const getEmpById = async (id) => {
  if (!id) {
    throw new Error('Employee ID is missing or invalid')
  }
  try {
    return await EmployeeModel.findById(id)
  } catch (error) {
    console.error('Error fetching employee by ID:', error)
    throw new Error('Failed to fetch employee')
  }
}
// Function to add a new employee to the database
const AddEmployee = async (newEmp) => {
  try {
    const newEmployee = new EmployeeModel(newEmp)
    newEmployee.save()
    return 'Created new Employee'
  } catch (error) {
    throw new Error('Failed to Add Employee')
  }
}
// Function to update an  employee by his id
const EditEmployee = async (id, updatedEmp) => {
  try {
    await EmployeeModel.findByIdAndUpdate(id, updatedEmp)
    return 'Employee Updated '
  } catch (error) {
    console.error('Error Updating Employee:', error)
    throw new Error('Failed to Update Employee')
  }
}
// Function to delete an employee by his id
const DeleteEmployee = async (id) => {
  try {
    await EmployeeModel.findByIdAndDelete(id)
    return 'Employee Deleted'
  } catch (error) {
    console.error('Error Deleting Employee:', error)
    throw new Error('Failed to Delete Employee')
  }
}

// Function to get the department name of an employee by his id
const getDepNameOfEmp = async (id) => {
  try {
    const emp = await getEmpById(id)
    const department = await DepartmentService.getDepById(emp.department)
    return department.name
  } catch (error) {
    console.error('Error fetching Department:', error)
    throw new Error('Failed to fetch department')
  }
}

// Function to get all employees belonging to a specific department
const getEmpByDepId = async (depid) => {
  try {
    const emp = await EmployeeModel.find({ department: depid })
    return emp
  } catch (error) {
    console.error('Error fetching emp by department id:', error)
    throw new Error('Error fetching emp by department id:')
  }
}
// Function to retrieve all shifts for a specific employee by his id
const getShiftByEmp = async (id) => {
  const employee = await getEmpById(id)

  if (!employee || !employee.shift || employee.shift.length === 0) {
    return [] // Return an empty array if there are no shifts
  }

  const shifstofEmp = employee.shift
  const shiftsPromises = shifstofEmp.map(async (shift) => {
    return await ShiftService.getShiftById(shift)
  })

  // Resolve all shift promises and return the list of shifts
  const Shifts = await Promise.all(shiftsPromises)
  return Shifts
}

module.exports = {
  getAllEmployees,
  getEmpById,
  getEmpByDepId,
  AddEmployee,
  EditEmployee,
  DeleteEmployee,
  getShiftByEmp,
  getDepNameOfEmp,
}
