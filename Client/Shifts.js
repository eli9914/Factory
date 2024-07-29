let token = localStorage.getItem('token')
if (!token) {
  alert('You need to log in first.')
  window.location.href = 'login.html'
}

function redirectToEmployees() {
  window.location.href = 'Employees.html'
}

function redirectToDepartments() {
  window.location.href = 'Departments.html'
}

// Function to populate the shift table
async function PopulateShiftTable() {
  try {
    const resp = await fetch('http://localhost:5000/shifts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) {
      throw new Error('Failed to fetch shifts')
    }

    const shifts = await resp.json()
    const shiftTable = document.getElementById('shiftTableBody')

    shifts.forEach((shift) => {
      const newTr = document.createElement('tr')

      const IdTd = document.createElement('td')
      const dateTd = document.createElement('td')
      const startTd = document.createElement('td')
      const endTd = document.createElement('td')
      const actionTd = document.createElement('td')

      IdTd.innerText = shift._id
      dateTd.innerText = formatDate(shift.date)
      startTd.innerText = shift.startingHour
      endTd.innerText = shift.endingHour

      const showEmployeesButton = document.createElement('button')
      showEmployeesButton.innerText = 'Show Employees'
      showEmployeesButton.onclick = () => showEmployeesOfShift(shift._id)

      actionTd.appendChild(showEmployeesButton)

      newTr.appendChild(IdTd)
      newTr.appendChild(dateTd)
      newTr.appendChild(startTd)
      newTr.appendChild(endTd)
      newTr.appendChild(actionTd)

      shiftTable.appendChild(newTr)
    })
  } catch (error) {
    console.error('Error fetching shifts:', error)
  }
}

// Function to show employees of a specific shift
async function showEmployeesOfShift(shiftId) {
  try {
    const resp = await fetch(
      `http://localhost:5000/shifts/${shiftId}/employees`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!resp.ok) {
      throw new Error('Failed to fetch shift employees')
    }
    const employees = await resp.json()
    const employeesSection = document.getElementById('employeesSection')

    // Clear previous employees list
    employeesSection.innerHTML = ''

    if (employees.length === 0) {
      // Display message when there are no employees
      const Massage = document.createElement('p')
      Massage.innerText = 'No Employees Assigned to this shift'
      employeesSection.appendChild(Massage)
    } else {
      // Display list of employees if there are any
      const employeeList = document.createElement('ul')
      employees.forEach((emp) => {
        const empli = document.createElement('li')
        empli.innerText =
          'Employee Name: ' +
          emp.name +
          ', ' +
          'Employee Start Year: ' +
          emp.start
        employeeList.appendChild(empli)
      })
      employeesSection.appendChild(employeeList)
    }

    //fetch all employees
    const allEmpResp = await fetch('http://localhost:5000/employee', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!allEmpResp.ok) {
      throw new Error('Failed to fetch employees')
    }
    const allEmployees = await allEmpResp.json()

    // Filter employees not in the shift
    const employeesNotInShift = allEmployees.filter(
      (emp) => !employees.some((shiftEmp) => shiftEmp._id === emp._id)
    )

    const EmpSelect = document.createElement('select')
    EmpSelect.id = 'EmpSelect'
    employeesNotInShift.forEach((emp) => {
      const option = document.createElement('option')
      option.value = emp._id
      option.innerText = emp.name
      EmpSelect.appendChild(option)
    })
    employeesSection.appendChild(EmpSelect)

    // Add button to assign selected employees
    const AddButton = document.createElement('button')
    AddButton.innerText = 'Add Employee To Shift'
    AddButton.onclick = () => AddEmpToShift(shiftId, employees)
    employeesSection.appendChild(AddButton)
  } catch (error) {
    console.error('Error fetching shift details:', error)
  }
}

// Function to add an employee to a shift
async function AddEmpToShift(shiftId, EmpsOfShift) {
  const EmpSelect = document.getElementById('EmpSelect')
  const Emp = EmpSelect.value

  try {
    //Update the Employees Of Shift
    const resp = await fetch(`http://localhost:5000/shifts/${shiftId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ employees: [...EmpsOfShift, Emp] }),
    })
    if (!resp.ok) {
      throw new Error('Failed to assign employees to shift')
    }
    alert('Employee assigned successfully')
    showEmployeesOfShift(shiftId)

    // Update the Shift of Employees
    const EmpResp = await fetch(`http://localhost:5000/employee/${Emp}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const employee = await EmpResp.json()

    // Add the new shift to the employee's shift array
    const updateEmpResp = await fetch(`http://localhost:5000/employee/${Emp}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shift: [...employee.shift, shiftId] }),
    })
    if (!updateEmpResp.ok) {
      throw new Error('Failed to Add employees to shift')
    }
  } catch (error) {
    console.error('Error assigning employees to shift:', error)
  }
}
// Function to create a new shift
async function CreateNewShift(event) {
  event.preventDefault()
  const date = document.getElementById('shiftDate').value
  const startingHour = document.getElementById('startingHour').value
  const endingHour = document.getElementById('endingHour').value
  const employees = []

  const formattedDate = new Date(date).toISOString().split('T')[0]

  try {
    const resp = await fetch('http://localhost:5000/shifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: formattedDate,
        startingHour,
        endingHour,
        employees,
      }),
    })
    if (!resp.ok) {
      throw new Error('Failed to create shift')
    }
    alert('Shift created successfully')
    window.location.href = 'Shifts.html'
  } catch (error) {
    console.error('Error creating shift:', error)
  }
}

// Function to format date in 'dd/mm/yyyy' format

function formatDate(isoDate) {
  const date = new Date(isoDate)
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
  return date.toLocaleString(undefined, options)
}
