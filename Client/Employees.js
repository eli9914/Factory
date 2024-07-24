document.addEventListener('DOMContentLoaded', () => {
  filterEmployees()
  filterEmployeesByDepartment()
})

function redirectToNewEmployee() {
  window.location.href = 'addEmployee.html'
}

function redirectToDepartments() {
  window.location.href = 'Departments.html'
}

function redirectToShifts() {
  window.location.href = 'Shifts.html'
}

async function filterEmployees() {
  const URL = 'http://localhost:5000/department'
  const resp = await fetch(URL)
  const departmentList = await resp.json()
  const depDropDown = document.getElementById('departmentFilter')

  for (const dep of departmentList) {
    const newOption = document.createElement('option')
    newOption.innerText = dep.name
    newOption.value = dep._id
    depDropDown.appendChild(newOption)
  }
}

async function filterEmployeesByDepartment() {
  const selectedDepartment = document.getElementById('departmentFilter').value
  const URL = 'http://localhost:5000/employee'
  try {
    const resp = await fetch(URL)
    if (!resp.ok) {
      throw new Error('Failed to fetch employees')
    }
    let employees = await resp.json()
    if (selectedDepartment) {
      employees = employees.filter(
        (emp) => emp.department === selectedDepartment
      )
    }
    populateEmployeeTable(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
}

function populateEmployeeTable(employees) {
  const table = document.getElementById('emptable')
  table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Department</th>
        <th>Employed since</th>
        <th>Shifts</th>
      </tr>`
  employees.forEach(async (emp) => {
    try {
      const shiftsResp = await fetch(
        `http://localhost:5000/employee/${emp._id}/shifts`
      )
      if (!shiftsResp.ok) {
        throw new Error('Shifts fetch was not ok')
      }

      const departmentResp = await fetch(
        `http://localhost:5000/employee/${emp._id}/department`
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

function formatDate(isoDate) {
  const date = new Date(isoDate)
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
  return date.toLocaleString(undefined, options)
}
