let token = localStorage.getItem('token')
if (!token) {
  alert('You need to log in first.')
  window.location.href = 'login.html'
}

async function redirectToDepartmentList() {
  window.location.href = 'Departments.html'
}

// Function to add a new department
async function AddDepartment() {
  const depName = document.getElementById('name').value

  // Check if the department name is provided
  if (depName === '') {
    alert('Department Name Required !!')
    return
  }

  // Create a new department object
  const newDepartment = {
    name: depName,
    manager: null,
  }

  try {
    const response = await fetch(`http://localhost:5000/department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDepartment),
    })
    if (!response.ok) {
      throw new Error('Failed to Add new department')
    }
    alert('Department Added successfully')
    window.location.href = 'Departments.html'
  } catch (error) {
    console.error('Error Adding new Department:', error)
  }
}
