let token

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  token = localStorage.getItem('token')
  if (!token) {
    // Redirect to login page if no token is found
    alert('You need to log in first.')
    window.location.href = 'login.html'
    return
  }
  // Fetch and display the username, and initialize filters
  fetchAndDisplayUsername()
  filterEmployees()
  filterEmployeesByDepartment()
})

// fetch and display the username
async function fetchAndDisplayUsername() {
  try {
    const resp = await fetch(`http://localhost:5000/auth/name`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) {
      throw new Error('Failed to fetch username')
    }
    const username = await resp.json()
    document.getElementById('usernameDisplay').innerText = `Hello ${username}`
  } catch (error) {
    console.error('Error fetching username:', error)
  }
}

// Logout and redirect to login page
function Logout() {
  localStorage.removeItem('token')
  window.location.href = 'login.html'
}

// Redirect to different pages
function redirectToNewEmployee() {
  window.location.href = 'addEmployee.html'
}

function redirectToDepartments() {
  window.location.href = 'Departments.html'
}

function redirectToShifts() {
  window.location.href = 'Shifts.html'
}

// Filter employees by department
async function filterEmployees() {
  const URL = 'http://localhost:5000/department'

  try {
    const resp = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!resp.ok) {
      throw new Error('Failed to fetch departments')
    }

    const departmentList = await resp.json()
    const depDropDown = document.getElementById('departmentFilter')

    // Populate the dropdown with department option
    depDropDown.innerHTML = '<option value="">All Departments</option>'

    for (const dep of departmentList) {
      const newOption = document.createElement('option')
      newOption.innerText = dep.name
      newOption.value = dep._id
      depDropDown.appendChild(newOption)
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
    alert('Failed to load departments. Please try again later.')
  }
}

// Filter employees based on selected department
async function filterEmployeesByDepartment() {
  const selectedDepartment = document.getElementById('departmentFilter').value
  const URL = 'http://localhost:5000/employee'

  try {
    const resp = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!resp.ok) {
      throw new Error('Failed to fetch employees')
    }

    let employees = await resp.json()

    // Filter employees if a department is selected
    if (selectedDepartment) {
      employees = employees.filter(
        (emp) => emp.department === selectedDepartment
      )
    }

    populateEmployeeTable(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    alert('Failed to load employees. Please try again later.')
  }
}

// Populate the employee table
function populateEmployeeTable(employees) {
  const table = document.getElementById('emptable')
  table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Department</th>
        <th>Employed since</th>
        <th>Shifts</th>
      </tr>`

  if (!Array.isArray(employees)) {
    console.error('Invalid employee data format:', employees)
    alert('Failed to load employees data. Please try again later.')
    return
  }

  // Fetch shifts for the employee
  employees.forEach(async (emp) => {
    try {
      const shiftsResp = await fetch(
        `http://localhost:5000/employee/${emp._id}/shifts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!shiftsResp.ok) {
        throw new Error('Shifts fetch was not ok')
      }
      // Fetch department name for the employee
      const departmentResp = await fetch(
        `http://localhost:5000/employee/${emp._id}/department`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!departmentResp.ok) {
        throw new Error('Department name fetch was not ok')
      }

      const depname = await departmentResp.json()
      const shifts = await shiftsResp.json()

      const newTr = document.createElement('tr')
      const TdName = document.createElement('td')
      const TdDep = document.createElement('td')
      const TdYear = document.createElement('td')
      const TdShift = document.createElement('td')

      TdName.innerHTML = `<a href="EditEmployee.html?id=${emp._id}">${emp.name}</a>`
      TdDep.innerHTML = `<a href="editDepartment.html?id=${emp.department}">${depname}</a>`
      TdYear.innerText = emp.start

      if (shifts.length > 0) {
        TdShift.innerHTML = shifts
          .map(
            (shift) =>
              `Date: ${formatDate(shift.date)}, Start: ${
                shift.startingHour
              }, End: ${shift.endingHour}`
          )
          .join('<br/>')
      } else {
        TdShift.innerText = 'No shifts'
      }

      newTr.appendChild(TdName)
      newTr.appendChild(TdDep)
      newTr.appendChild(TdYear)
      newTr.appendChild(TdShift)
      table.appendChild(newTr)
    } catch (error) {
      console.error('Error fetching shifts for employee:', emp._id, error)
    }
  })
}

// Format date to a readable format

function formatDate(isoDate) {
  const date = new Date(isoDate)
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
  return date.toLocaleString(undefined, options)
}
