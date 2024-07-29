let token

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login page if the token is not found
  token = localStorage.getItem('token')
  if (!token) {
    alert('You need to log in first.')
    window.location.href = 'login.html'
    return
  }

  // Get the employee ID from the URL query parameters
  const params = new URLSearchParams(window.location.search)
  const empId = params.get('id')
  if (empId) {
    fetchEmployee(empId)
    fetchShifts(empId)
  }
  fetchDepartments()
})

// Navigate to the previous page
async function GoBack() {
  window.history.back()
}

// Fetch and display the details of the employee based on the provided ID
async function fetchEmployee(id) {
  try {
    const response = await fetch(`http://localhost:5000/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch employee data')
    }
    const employee = await response.json()
    document.getElementById('empId').value = employee._id
    document.getElementById('name').value = employee.name
    document.getElementById('start').value = employee.start

    // Fetch departments and then set the selected department
    await fetchDepartments()
    document.getElementById('department').value = employee.department
  } catch (error) {
    console.error('Error fetching employee:', error)
  }
}

// Fetch the list of departments and populate the dropdown
async function fetchDepartments() {
  try {
    const resp = await fetch('http://localhost:5000/department', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) {
      throw new Error('Failed to fetch departments')
    }
    const departments = await resp.json()
    const departmentSelect = document.getElementById('department')

    // Clear previous options and add new department options
    departmentSelect.innerHTML = ''
    departments.forEach((dep) => {
      const option = document.createElement('option')
      option.value = dep._id
      option.text = dep.name
      departmentSelect.appendChild(option)
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

// Update the employee details with the data from the form
async function updateEmployee() {
  const empId = document.getElementById('empId').value
  const updatedEmployee = {
    name: document.getElementById('name').value,
    department: document.getElementById('department').value,
    start: document.getElementById('start').value,
  }

  try {
    const response = await fetch(`http://localhost:5000/employee/${empId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedEmployee),
    })
    if (!response.ok) {
      throw new Error('Failed to update employee')
    }
    alert('Employee updated successfully')
    window.location.href = 'employees.html'
  } catch (error) {
    console.error('Error updating employee:', error)
  }
}

// Delete the employee and handle associated data such as shifts and department
async function DeleteEmployee() {
  const empId = document.getElementById('empId').value

  try {
    // Fetch the employee details
    const empResponse = await fetch(`http://localhost:5000/employee/${empId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!empResponse.ok) {
      throw new Error('Failed to fetch employee')
    }
    const employee = await empResponse.json()

    // If the employee is a manager, update the department to remove the manager
    if (employee && employee.department) {
      const departmentId = employee.department

      const deptResponse = await fetch(
        `http://localhost:5000/department/${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!deptResponse.ok) {
        throw new Error('Failed to fetch department')
      }
      const department = await deptResponse.json()

      // Check if the employee is the manager
      if (department.manager === empId) {
        // Update department to remove the manager
        const updatedDepartment = {
          ...department,
          manager: null,
        }

        const updateDeptResponse = await fetch(
          `http://localhost:5000/department/${departmentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedDepartment),
          }
        )

        if (!updateDeptResponse.ok) {
          throw new Error('Failed to update department')
        }
      }
    }

    // Remove the employee from any shifts they are assigned to
    await DeleteEmpFromShift(empId)

    // Delete the employee
    const deleteEmpResponse = await fetch(
      `http://localhost:5000/employee/${empId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!deleteEmpResponse.ok) {
      throw new Error('Failed to delete employee')
    }

    alert('Employee deleted successfully')
    window.location.href = 'employees.html'
  } catch (error) {
    console.error('Error deleting employee:', error)
  }
}

// Remove the employee from all shifts they are assigned to
async function DeleteEmpFromShift(empId) {
  try {
    console.log('Hello from DeleteEmpFromShift')
    const shiftsResp = await fetch(
      `http://localhost:5000/employee/${empId}/shifts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!shiftsResp.ok) {
      throw new Error('Failed to fetch employee shifts')
    }

    const shifts = await shiftsResp.json()

    // Update each shift to remove the employee
    for (const shift of shifts) {
      console.log('Shift:', shift)
      const updatedEmployees = shift.employees.filter((emp) => emp !== empId)
      console.log('Updated Employees:', updatedEmployees)
      const resp = await fetch(`http://localhost:5000/shifts/${shift._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employees: updatedEmployees }),
      })
      if (!resp.ok) {
        throw new Error('Failed to update shift')
      }
    }
  } catch (error) {
    console.error('Error deleting employee from shifts:', error)
  }
}

// Fetch and display the shifts for the specified employee
async function fetchShifts(empid) {
  try {
    const response = await fetch(
      `http://localhost:5000/employee/${empid}/shifts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch shifts')
    }
    const shifts = await response.json()
    const shiftTable = document.getElementById('shiftTable')

    // Populate the shifts table with shift data
    shifts.forEach((shift) => {
      const newTr = document.createElement('tr')

      const tdDate = document.createElement('td')
      const tdStart = document.createElement('td')
      const tdEnd = document.createElement('td')

      tdDate.innerText = shift.date.split('T')[0]
      tdStart.innerText = shift.startingHour
      tdEnd.innerText = shift.endingHour

      newTr.appendChild(tdDate)
      newTr.appendChild(tdStart)
      newTr.appendChild(tdEnd)

      shiftTable.appendChild(newTr)
    })
  } catch (error) {
    console.error('Error loading shifts:', error)
  }
}
