import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/"); return }
    const fetchData = async () => {
      try {
        const [empRes, deptRes, salRes] = await Promise.all([
          api.get("/api/employee/all"),
          api.get("/api/department/all"),
          api.get("/api/salary/view"),
        ])
        setEmployees(empRes.data)
        setDepartments(deptRes.data)
        setSalaries(salRes.data.salaries || salRes.data)
      } catch (e) {
        if (e.response?.status === 401) { localStorage.removeItem("token"); navigate("/") }
        setErr("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 flex flex-col gap-8">

        {err && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">
            {err}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Employees</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-1">{employees.length}</h2>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Departments</p>
            <h2 className="text-4xl font-bold text-green-600 mt-1">{departments.length}</h2>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Payroll</p>
            <h2 className="text-4xl font-bold text-purple-600 mt-1">
              {salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0).toLocaleString()} RWF
            </h2>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Employees</h2>
          {employees.length === 0 ? (
            <p className="text-sm text-gray-400">No employees found</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="pb-2">Employee No</th>
                  <th className="pb-2">First Name</th>
                  <th className="pb-2">Last Name</th>
                  <th className="pb-2">Position</th>
                  <th className="pb-2">Gender</th>
                  <th className="pb-2">Hired Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{emp.employeeNumber}</td>
                    <td className="py-2">{emp.firstName}</td>
                    <td className="py-2">{emp.lastName}</td>
                    <td className="py-2">{emp.position}</td>
                    <td className="py-2">{emp.gender}</td>
                    <td className="py-2">{new Date(emp.hiredDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Departments & Salaries Table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Departments & Salaries</h2>
          {departments.length === 0 ? (
            <p className="text-sm text-gray-400">No departments found</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="pb-2">Dept Code</th>
                  <th className="pb-2">Department Name</th>
                  <th className="pb-2">Gross Salary</th>
                  <th className="pb-2">Total Deduction</th>
                  <th className="pb-2">Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => {
                  const sal = salaries.find((s) => s.deptCode === dept._id || s.deptCode?._id === dept._id)
                  return (
                    <tr key={dept._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{dept.deptCode}</td>
                      <td className="py-2">{dept.departmentName}</td>
                      <td className="py-2">{sal ? sal.grossSalary?.toLocaleString() + " RWF" : "—"}</td>
                      <td className="py-2">{sal ? sal.totalDeduction?.toLocaleString() + " RWF" : "—"}</td>
                      <td className="py-2">{sal ? sal.netSalary?.toLocaleString() + " RWF" : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard