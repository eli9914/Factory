document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search)
  const depId = params.get('id')
  if (depId) {
    await fetchDepartment(depId)
  }
  await fetchAllEmployees()
})

async function fetchDepartment(id) {
  try {
    const resp = await fetch(`http://localhost:5000/department/${id}`)
    if (!resp.ok) {
      throw new Error('Failed to fetch department data')
    }
    const department = await resp.json()

    document.getElementById('depId').value = department._id
    document.getElementById('name').value = department.name

    await fetchDepEmployees(department._id)
    document.getElementById('manager').value = department.manager
  } catch (error) {
    console.error('Error fetching department:', error)
  }
}

async function fetchDepEmployees(id) {
  const resp = await fetch(`http://localhost:5000/employee/department/${id}`)
  if (!resp.ok) {
    throw new Error('Failed to fetch department employees')
  }
  const employees = await resp.json()
  const employeeSelect = document.getElementById('manager')
  employeeSelect.innerHTML = '' // Clear previous options
  employees.forEach((emp) => {
    const option = document.createElement('option')
    option.value = emp._id
    option.text = emp.name
    employeeSelect.appendChild(option)
  })
}

async function fetchAllEmployees() {
  const resp = await fetch(`http://localhost:5000/employee`)
  if (!resp.ok) {
    throw new Error('Failed to fetch employees')
  }
  const employees = await resp.json()

  const addEmpSelect = document.getElementById('addemp')
  const managerSelect = document.getElementById('manager')
  addEmpSelect.innerHTML = '' // Clear previous options

  // Get the manager IDs that are already in the manager select
  const managerIds = Array.from(managerSelect.options).map(
    (option) => option.value
  )

  employees.forEach((emp) => {
    if (!managerIds.includes(emp._id)) {
      const option = document.createElement('option')
      option.value = emp._id
      option.text = emp.name
      addEmpSelect.appendChild(option)
    }
  })
}

async function addEmployeeToDepartment() {
  const empId = document.getElementById('addemp').value
  const depId = document.getElementById('depId').value

  try {
    // Fetch the employee data
    const resp = await fetch(`http://localhost:5000/employee/${empId}`)
    if (!resp.ok) {
      throw new Error('Failed to fetch employee')
    }
    const emp = await resp.json()

    // Update the employee's department
    const updatedEmployee = {
      ...emp,
      department: depId,
    }

    // Send the updated employee data to the server
    const response = await fetch(`http://localhost:5000/employee/${empId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEmployee),
    })

    if (!response.ok) {
      throw new Error('Failed to add employee to department')
    }
    alert('Employee added to department successfully')
    window.location.reload()
  } catch (error) {
    console.error('Error adding employee to department:', error)
  }
}

async function updateDepartment() {
  const depId = document.getElementById('depId').value
  const updatedDepartment = {
    name: document.getElementById('name').value,
    manager: document.getElementById('manager').value,
  }
  try {
    const response = await fetch(`http://localhost:5000/department/${depId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDepartment),
    })
    if (!response.ok) {
      throw new Error('Failed to update department')
    }
    alert('Department updated successfully')
    window.location.href = 'Departments.html'
  } catch (error) {
    console.error('Error updating department:', error)
  }
}

async function DeleteDepartment() {
  const depId = document.getElementById('depId').value
  try {
    // Fetch all employees of the department
    const empResponse = await fetch(
      `http://localhost:5000/employee/department/${depId}`
    )
    if (!empResponse.ok) {
      throw new Error('Failed to fetch employees of the department')
    }
    const employees = await empResponse.json()

    // Delete each employee
    for (const emp of employees) {
      await DeleteEmployee(emp._id)
    }

    // Delete the department
    const response = await fetch(`http://localhost:5000/department/${depId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete department')
    }

    alert('Department deleted successfully')
    window.location.href = 'departments.html'
  } catch (error) {
    console.error('Error deleting department:', error)
  }
}

async function DeleteEmployee(empId) {
  await DeleteEmpFromShift(empId)
  try {
    const response = await fetch(`http://localhost:5000/employee/${empId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete employee')
    }
    console.log('Employee deleted successfully:', empId) // Added for debugging
  } catch (error) {
    console.error('Error deleting employee:', error)
  }
}

async function DeleteEmpFromShift(empId) {
  try {
    const shiftsResp = await fetch(
      `http://localhost:5000/employee/${empId}/shifts`
    )
    if (!shiftsResp.ok) {
      throw new Error('Failed to fetch employee shifts')
    }

    const shifts = await shiftsResp.json()

    // Ensure to handle each shift update
    const updateShiftPromises = shifts.map(async (shift) => {
      try {
        const updatedEmployees = shift.employees.filter((emp) => emp !== empId)
        const resp = await fetch(`http://localhost:5000/shifts/${shift._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ employees: updatedEmployees }),
        })
        if (!resp.ok) {
          throw new Error(`Failed to update shift ${shift._id}`)
        }
      } catch (error) {
        console.error(`Error updating shift ${shift._id}:`, error)
      }
    })

    await Promise.all(updateShiftPromises)
  } catch (error) {
    console.error('Error deleting employee from shifts:', error)
  }
}
