import React, { useState, useEffect } from 'react'
import axios from 'axios'

function ServiceRecord() {
  const [records, setRecords] = useState([])
  const [cars, setCars] = useState([])
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [recordNumber, setRecordNumber] = useState('')
  const [serviceDate, setServiceDate] = useState('')
  const [carId, setCarId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [showForm, setShowForm] = useState(false)

  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchRecords()
    fetchCars()
    fetchServices()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${api}/api/service-records`)
      setRecords(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${api}/api/cars`)
      setCars(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${api}/api/services`)
      setServices(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setRecordNumber('')
    setServiceDate('')
    setCarId('')
    setServiceId('')
    setShowForm(false)
  }

  const handleEdit = (record) => {
    setEditingId(record._id)
    setRecordNumber(record.recordNumber || '')
    setServiceDate(record.serviceDate ? new Date(record.serviceDate).toISOString().split('T')[0] : '')
    setCarId(record.carId?._id || record.carId || '')
    setServiceId(record.serviceId?._id || record.serviceId || '')
    setShowForm(true)
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return
    try {
      await axios.delete(`${api}/api/service-records/${id}`)
      fetchRecords()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      recordNumber,
      serviceDate: serviceDate || new Date(),
      carId,
      serviceId
    }
    try {
      if (editingId) {
        await axios.put(`${api}/api/service-records/${editingId}`, payload)
      } else {
        await axios.post(`${api}/api/service-records`, payload)
      }
      resetForm()
      fetchRecords()
    } catch (err) {
      alert('Failed to save record')
    }
  }

  const closeModal = () => {
    resetForm()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-800">Service Records</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> Add New Record
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Record List</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">Record #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{r.recordNumber}</td>
                <td className="px-4 py-3">{r.serviceDate ? new Date(r.serviceDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">{r.carId?.plateNumber || '-'}</td>
                <td className="px-4 py-3">{r.serviceId?.serviceName || '-'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{editingId ? 'Edit Record' : 'Add Record'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Record Number</label>
                <input type="text" value={recordNumber} onChange={(e) => setRecordNumber(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Service Date</label>
                <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Car</label>
                <select 
                  value={carId} 
                  onChange={(e) => setCarId(e.target.value)} 
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 appearance-none cursor-pointer" 
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px'}}
                  required
                >
                  <option value="" disabled>Select a car...</option>
                  {cars.map((c) => (
                    <option key={c._id} value={c._id}>{c.plateNumber} - {c.model} ({c.type})</option>
                  ))}
                </select>
                {cars.length === 0 && <p className="text-xs text-red-500 mt-1">No cars available. Please add cars first.</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Service</label>
                <select 
                  value={serviceId} 
                  onChange={(e) => setServiceId(e.target.value)} 
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 appearance-none cursor-pointer" 
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px'}}
                  required
                >
                  <option value="" disabled>Select a service...</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.serviceName} - {s.servicePrice} RWF</option>
                  ))}
                </select>
                {services.length === 0 && <p className="text-xs text-red-500 mt-1">No services available. Please add services first.</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition">{editingId ? 'Update Record' : 'Add Record'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceRecord
