const express = require('express')

const cors = require('cors')

require('./Config/connectToDB')
const authController = require('./Controllers/auhtController')

const DepController = require('./Controllers/DepartmentController')
const empcontroller = require('./Controllers/EmployeeController')
const ShiftController = require('./Controllers/ShiftController')
const app = express()

app.use(cors())

app.use(express.json())

app.use('/auth', authController)
app.use('/employee', empcontroller)
app.use('/department', DepController)
app.use('/shifts', ShiftController)

const port = 5000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
