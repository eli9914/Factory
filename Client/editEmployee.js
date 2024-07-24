document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const empId = params.get('id')
  if (empId) {
    fetchEmployee(empId)
    fetchShifts(empId)
  }
  fetchDepartments()
})

async function fetchEmployee(id) {
  try {
    const response = await fetch(`http://localhost:5000/employee/${id}`)
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

async function fetchDepartments() {
  try {
    const resp = await fetch('http://localhost:5000/department')
    if (!resp.ok) {
      throw new Error('Failed to fetch departments')
    }
    const departments = await resp.json()
    const departmentSelect = document.getElementById('department')
    departmentSelect.innerHTML = '' // Clear previous options
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
async function DeleteEmployee() {
  const empId = document.getElementById('empId').value

  try {
    // Check if the employee is a manager
    const empResponse = await fetch(`http://localhost:5000/employee/${empId}`)
    if (!empResponse.ok) {
      throw new Error('Failed to fetch employee')
    }
    const employee = await empResponse.json()

    if (employee && employee.department) {
      const departmentId = employee.department

      // Fetch department details
      const deptResponse = await fetch(
        `http://localhost:5000/department/${departmentId}`
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
            },
            body: JSON.stringify(updatedDepartment),
          }
        )

        if (!updateDeptResponse.ok) {
          throw new Error('Failed to update department')
        }
      }
    }

    // Proceed to delete the employee
    await DeleteEmpFromShift(empId)

    const deleteEmpResponse = await fetch(
      `http://localhost:5000/employee/${empId}`,
      {
        method: 'DELETE',
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

async function DeleteEmpFromShift(empId) {
  try {
    console.log('Hello from DeleteEmpFromShift')
    const shiftsResp = await fetch(
      `http://localhost:5000/employee/${empId}/shifts`
    )
    if (!shiftsResp.ok) {
      throw new Error('Failed to fetch employee shifts')
    }
    console.log('shiftsResp', shiftsResp)
    const shifts = await shiftsResp.json()
    console.log('Shifts:', shifts)

    for (const shift of shifts) {
      console.log('Shift:', shift)
      const updatedEmployees = shift.employees.filter((emp) => emp !== empId)
      console.log('Updated Employees:', updatedEmployees)
      const resp = await fetch(`http://localhost:5000/shifts/${shift._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

async function fetchShifts(empid) {
  try {
    const response = await fetch(
      `http://localhost:5000/employee/${empid}/shifts`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch shifts')
    }
    const shifts = await response.json()
    const shiftTable = document.getElementById('shiftTable')
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
