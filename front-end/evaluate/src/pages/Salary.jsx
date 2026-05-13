import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const Salary = () => {
  const [salaries, setSalaries] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ grossSalary: '', totalDeduction: '', netSalary: '', month: '', deptCode: '' })
  const [editingId, setEditingId] = useState(null)
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
      const [salRes, deptRes] = await Promise.all([
        api.get('/api/salary/view'),
        api.get('/api/department/all')
      ])
      setSalaries(salRes.data.salaries || [])
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
    const payload = {
      grossSalary: Number(form.grossSalary),
      totalDeduction: Number(form.totalDeduction),
      netSalary: Number(form.netSalary),
      month: form.month,
      deptCode: form.deptCode
    }
    try {
      if (editingId) {
        await api.put(`/api/salary/update/${editingId}`, payload)
        setSuccess('Salary updated successfully')
        setEditingId(null)
      } else {
        await api.post('/api/salary/new', payload)
        setSuccess('Salary created successfully')
      }
      setForm({ grossSalary: '', totalDeduction: '', netSalary: '', month: '', deptCode: '' })
      fetchData()
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save salary')
    }
  }

  const handleEdit = (sal) => {
    setEditingId(sal._id)
    setForm({
      grossSalary: sal.grossSalary,
      totalDeduction: sal.totalDeduction,
      netSalary: sal.netSalary,
      month: sal.month,
      deptCode: sal.deptCode?._id || sal.deptCode || ''
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return
    try {
      await api.delete(`/api/salary/delete/${id}`)
      setSuccess('Salary deleted successfully')
      fetchData()
    } catch (e) {
      setErr('Failed to delete salary')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm({ grossSalary: '', totalDeduction: '', netSalary: '', month: '', deptCode: '' })
  }

  const downloadReport = () => {
    window.open('http://localhost:4000/api/salary/report', '_blank')
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
          <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
          <button onClick={downloadReport} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200">
            Download Excel Report
          </button>
        </div>

        {err && <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">{err}</div>}
        {success && <div className="bg-green-100 text-green-600 text-sm px-4 py-2 rounded-lg">{success}</div>}

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Salary' : 'Add New Salary'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input name="grossSalary" type="number" value={form.grossSalary} onChange={handleChange} placeholder="Gross Salary" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="totalDeduction" type="number" value={form.totalDeduction} onChange={handleChange} placeholder="Total Deduction" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="netSalary" type="number" value={form.netSalary} onChange={handleChange} placeholder="Net Salary" className="border rounded-lg px-3 py-2 text-sm" required />
            <input name="month" type="month" value={form.month} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm" required />
            <select name="deptCode" value={form.deptCode} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm" required>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.departmentName}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200">
                {editingId ? 'Update Salary' : 'Add Salary'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Salary Records</h2>
          {salaries.length === 0 ? (
            <p className="text-sm text-gray-400">No salary records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="pb-2">Month</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Gross Salary</th>
                    <th className="pb-2">Total Deduction</th>
                    <th className="pb-2">Net Salary</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((sal) => (
                    <tr key={sal._id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{sal.month}</td>
                      <td className="py-2">{sal.deptCode?.departmentName || sal.deptCode?.deptCode || '—'}</td>
                      <td className="py-2">{sal.grossSalary?.toLocaleString()} RWF</td>
                      <td className="py-2">{sal.totalDeduction?.toLocaleString()} RWF</td>
                      <td className="py-2">{sal.netSalary?.toLocaleString()} RWF</td>
                      <td className="py-2 flex gap-2">
                        <button onClick={() => handleEdit(sal)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-lg cursor-pointer transition duration-200">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(sal._id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg cursor-pointer transition duration-200">
                          Delete
                        </button>
                      </td>
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

export default Salary
