const DepModel = require('../Models/DepartmentModel')

const getAllDepartments = async () => {
  try {
    return await DepModel.find({})
  } catch (error) {
    throw error
  }
}

const getDepById = async (id) => {
  try {
    return await DepModel.findById(id)
  } catch (error) {
    console.error('Error fetching Department by ID:', error)
    throw new Error('Failed to fetch Department')
  }
}

const EditDep = async (id, updatedDep) => {
  try {
    await DepModel.findByIdAndUpdate(id, updatedDep)
    return 'Department Updated '
  } catch (error) {
    console.error('Error Updating Department:', error)
    throw new Error('Failed to Update Department')
  }
}
const AddDep = async (newDep) => {
  try {
    const newDepartment = new DepModel(newDep)
    newDepartment.save()
    return 'Created new Department'
  } catch (error) {
    throw new Error('Failed to Add Department')
  }
}
const DeleteDep = async (id) => {
  try {
    await DepModel.findByIdAndDelete(id)
    return 'Department Deleted'
  } catch (error) {
    console.error('Error Deleting Department:', error)
    throw new Error('Failed to Delete Department')
  }
}

module.exports = { getAllDepartments, getDepById, EditDep, AddDep, DeleteDep }
