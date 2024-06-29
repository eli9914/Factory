const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
  name: String,
  start: Number,
  department: String,
  shift: [{ type: Schema.Types.ObjectId, ref: 'Shifts' }],
})

module.exports = mongoose.model('Employee', employeeSchema, 'Employees')
