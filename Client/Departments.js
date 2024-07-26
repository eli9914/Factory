let token = localStorage.getItem('token')
if (!token) {
  alert('You need to log in first.')
  window.location.href = 'login.html'
}

function redirectToNewDepartment() {
  window.location.href = 'addDepartment.html'
}

function redirectToEmployees() {
  window.location.href = 'Employees.html'
}

async function populateDepartmentTable() {
  const depTableBody = document.getElementById('DepTableBody')

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

    for (const department of departments) {
      const newTr = document.createElement('tr')

      // Fetch manager details if department has a manager
      let manager = { name: 'No Manager Assigned' } // Default manager value
      if (department.manager) {
        const managerResp = await fetch(
          `http://localhost:5000/employee/${department.manager}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!managerResp.ok) {
          throw new Error('Failed to fetch manager')
        }
        manager = await managerResp.json()
      }

      // Fetch employees in the department
      const empResp = await fetch(
        `http://localhost:5000/employee/department/${department._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!empResp.ok) {
        throw new Error('Failed to fetch employees in department')
      }
      const employees = await empResp.json()

      // Create table cells for department details
      const tdName = document.createElement('td')
      const tdManager = document.createElement('td')
      const tdEmployees = document.createElement('td')

      tdName.innerText = department.name
      tdName.innerHTML = `<a href="editDepartment.html?id=${department._id}">${tdName.innerText}</a>`

      tdManager.innerHTML =
        manager.name === 'No Manager Assigned'
          ? manager.name // Display as plain text
          : `<a href="editEmployee.html?id=${manager._id}">${manager.name}</a>`

      // Concatenate employee names into a single string
      const employeeNames = employees.map((emp) => emp.name).join(', ')
      tdEmployees.innerText = employeeNames

      // Append cells to the new row
      newTr.appendChild(tdName)
      newTr.appendChild(tdManager)
      newTr.appendChild(tdEmployees)

      // Append row to the table body
      depTableBody.appendChild(newTr)
    }
  } catch (error) {
    console.error('Error loading departments:', error)
  }
}
