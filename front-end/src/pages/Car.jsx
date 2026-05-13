import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Car() {
  const [cars, setCars] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [plateNumber, setPlateNumber] = useState('')
  const [type, setType] = useState('')
  const [model, setModel] = useState('')
  const [manufacturingyear, setManufacturingyear] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [mechanicName, setMechanicName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${api}/api/cars`)
      setCars(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setPlateNumber('')
    setType('')
    setModel('')
    setManufacturingyear('')
    setDriverPhone('')
    setMechanicName('')
    setShowForm(false)
  }

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${api}/api/cars/${id}`)
      const c = res.data
      setEditingId(id)
      setPlateNumber(c.plateNumber || '')
      setType(c.type || '')
      setModel(c.model || '')
      setManufacturingyear(c.manufacturingyear || '')
      setDriverPhone(c.driverPhone || '')
      setMechanicName(c.mechanicName || '')
      setShowForm(true)
    } catch (err) {
      alert('Failed to load car for editing')
    }
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this car?')) return
    try {
      await axios.delete(`${api}/api/cars/${id}`)
      fetchCars()
    } catch (err) {
      alert('Failed to delete car')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { plateNumber, type, model, manufacturingyear, driverPhone, mechanicName }
    try {
      if (editingId) {
        await axios.put(`${api}/api/cars/${editingId}`, payload)
      } else {
        await axios.post(`${api}/api/cars`, payload)
      }
      resetForm()
      fetchCars()
    } catch (err) {
      alert('Failed to save car')
    }
  }

  const closeModal = () => {
    resetForm()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-800">Car Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> Add New Car
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Car List</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">Plate Number</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Mechanic</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{c.plateNumber}</td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3">{c.model}</td>
                <td className="px-4 py-3">{c.manufacturingyear}</td>
                <td className="px-4 py-3">{c.driverPhone}</td>
                <td className="px-4 py-3">{c.mechanicName}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(c._id)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-6 text-center text-gray-500">No cars found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{editingId ? 'Edit Car' : 'Add Car'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Plate Number</label>
                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Manufacturing Year</label>
                <input type="text" value={manufacturingyear} onChange={(e) => setManufacturingyear(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Driver Phone</label>
                <input type="text" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mechanic Name</label>
                <input type="text" value={mechanicName} onChange={(e) => setMechanicName(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition">{editingId ? 'Update Car' : 'Add Car'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Car
