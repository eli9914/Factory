const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shiftSchema = new Schema({
  date: { type: Date, required: true },
  startingHour: { type: Number, required: true },
  endingHour: { type: Number, required: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
})

module.exports = mongoose.model('Shift', shiftSchema, 'Shifts')
