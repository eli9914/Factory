const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost:27017/Factory')
  .then(() => console.log('Connected to DB...'))
