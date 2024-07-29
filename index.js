const express = require('express')
const cors = require('cors')

const path = require('path')
const opn = require('opn')

require('./Config/connectToDB')
const authController = require('./Controllers/auhtController')
const authMiddleware = require('./Middlwares/authMiddleware')

const DepController = require('./Controllers/DepartmentController')
const empcontroller = require('./Controllers/EmployeeController')
const ShiftController = require('./Controllers/ShiftController')

const app = express()

app.use(cors())

app.use(express.json())

// Serve static files from the 'Client' folder
app.use(express.static(path.join(__dirname, 'Client')))

// Redirect root to login.html
app.get('/', (req, res) => {
  res.redirect('./login.html')
})

app.use('/auth', authController)

app.use('/employee', authMiddleware, empcontroller)
app.use('/department', authMiddleware, DepController)
app.use('/shifts', authMiddleware, ShiftController)

const port = 5000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Open login.html in the default browser
opn(`http://localhost:${port}/login.html`)
