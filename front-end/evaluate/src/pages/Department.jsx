import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const Department = () => {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ deptCode: '', departmentName: '', grossSalary: '' })
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
      const res = await api.get('/api/department/all')
      setDepartments(res.data)
    } catch (e) {
      if (e.response?.status === 401) { localStorage.removeItem("token"); navigate("/") }
      setErr('Failed to load departments')
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
      await api.post('/api/department/new', { ...form, grossSalary: Number(form.grossSalary) })
      setSuccess('Department created successfully')
      setForm({ deptCode: '', departmentName: '', grossSalary: '' })
      fetchData()
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to create department')
    }
  }

  const downloadReport = () => {
    window.open('http://localhost:4000/api/department/report', '_blank')
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
          <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
          <button onClick={downloadReport} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200">
            Download Excel Report
          </button>
        </div>

        {err && <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">{err}</div>}
        {success && <div className="bg-green-100 text-green-600 text-sm px-4 py-2 rounded-lg">{success}</div>}

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Department</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input name="deptCode" value={form.deptCode} onChange={handleChange} placeholder="Department Code" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="departmentName" value={form.departmentName} onChange={handleChange} placeholder="Department Name" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="grossSalary" type="number" value={form.grossSalary} onChange={handleChange} placeholder="Gross Salary" className="border rounded-lg px-3 py-2 text-sm" required />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200">
              Add Department
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Departments List</h2>
          {departments.length === 0 ? (
            <p className="text-sm text-gray-400">No departments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="pb-2">Dept Code</th>
                    <th className="pb-2">Department Name</th>
                    <th className="pb-2">Gross Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{dept.deptCode}</td>
                      <td className="py-2">{dept.departmentName}</td>
                      <td className="py-2">{dept.grossSalary?.toLocaleString()} RWF</td>
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

export default Department
