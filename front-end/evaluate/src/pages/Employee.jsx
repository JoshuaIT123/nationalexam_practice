import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const Employee = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    employeeNumber: '', firstName: '', lastName: '', position: '',
    address: '', telephone: '', hiredDate: '', gender: '', deptId: ''
  })
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/"); return }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('/api/employee/all'),
        api.get('/api/department/all')
      ])
      setEmployees(empRes.data)
      setDepartments(deptRes.data)
    } catch (e) {
      if (e.response?.status === 401) { localStorage.removeItem("token"); navigate("/") }
      setErr('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setSuccess('')
    try {
      await api.post('/api/employee/new', form)
      setSuccess('Employee created successfully')
      setForm({ employeeNumber: '', firstName: '', lastName: '', position: '', address: '', telephone: '', hiredDate: '', gender: '', deptId: '' })
      fetchData()
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to create employee')
    }
  }

  const downloadReport = () => {
    const token = localStorage.getItem("token")
    window.open(`http://localhost:4000/api/employee/report?token=${token}`, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
          <button onClick={downloadReport} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200">
            Download Excel Report
          </button>
        </div>

        {err && <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">{err}</div>}
        {success && <div className="bg-green-100 text-green-600 text-sm px-4 py-2 rounded-lg">{success}</div>}

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Employee</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input name="employeeNumber" value={form.employeeNumber} onChange={handleChange} placeholder="Employee Number" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Telephone" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="hiredDate" type="date" value={form.hiredDate} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm" required />
            <select name="gender" value={form.gender} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm" required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select name="deptId" value={form.deptId} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm" required>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.departmentName}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200 col-start-1">
              Add Employee
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Employees List</h2>
          {employees.length === 0 ? (
            <p className="text-sm text-gray-400">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="pb-2">Employee No</th>
                    <th className="pb-2">First Name</th>
                    <th className="pb-2">Last Name</th>
                    <th className="pb-2">Position</th>
                    <th className="pb-2">Gender</th>
                    <th className="pb-2">Department</th>
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
                      <td className="py-2">{emp.deptId?.departmentName || '—'}</td>
                      <td className="py-2">{new Date(emp.hiredDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Employee
