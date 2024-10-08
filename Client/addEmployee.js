let token = localStorage.getItem('token')
if (!token) {
  alert('You need to log in first.')
  window.location.href = 'login.html'
}

async function redirectToAllEmployees() {
  window.location.href = 'employees.html'
}

// Fetch and populate the departments dropdown
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

// Add a new employee based on the form input
async function AddEmployee() {
  const newEmployee = {
    name: document.getElementById('name').value,
    department: document.getElementById('department').value,
    start: document.getElementById('start').value,
  }
  try {
    const response = await fetch('http://localhost:5000/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEmployee),
    })
    if (!response.ok) {
      throw new Error('Failed to add new employee')
    }
    alert('Employee added successfully')
    window.location.href = 'employees.html'
  } catch (error) {
    console.error('Error adding new employee:', error)
  }
}
