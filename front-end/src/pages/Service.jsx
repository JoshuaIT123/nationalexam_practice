import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Service() {
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [serviceCode, setServiceCode] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  const [showForm, setShowForm] = useState(false)

  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${api}/api/services`)
      setServices(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setServiceCode('')
    setServiceName('')
    setServicePrice('')
    setShowForm(false)
  }

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${api}/api/services/${id}`)
      const s = res.data
      setEditingId(id)
      setServiceCode(s.serviceCode || '')
      setServiceName(s.serviceName || '')
      setServicePrice(s.servicePrice || '')
      setShowForm(true)
    } catch (err) {
      alert('Failed to load service for editing')
    }
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await axios.delete(`${api}/api/services/${id}`)
      fetchServices()
    } catch (err) {
      alert('Failed to delete service')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { serviceCode, serviceName, servicePrice }
    try {
      if (editingId) {
        await axios.put(`${api}/api/services/${editingId}`, payload)
      } else {
        await axios.post(`${api}/api/services`, payload)
      }
      resetForm()
      fetchServices()
    } catch (err) {
      alert('Failed to save service')
    }
  }

  const closeModal = () => {
    resetForm()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-800">Service Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> Add New Service
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Service List</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{s.serviceCode}</td>
                <td className="px-4 py-3">{s.serviceName}</td>
                <td className="px-4 py-3">{s.servicePrice}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(s._id)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-500">No services found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{editingId ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Service Code</label>
                <input type="text" value={serviceCode} onChange={(e) => setServiceCode(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Service Name</label>
                <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Service Price</label>
                <input type="text" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition">{editingId ? 'Update Service' : 'Add Service'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Service
