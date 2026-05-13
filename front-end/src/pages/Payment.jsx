import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Payment() {
  const [payments, setPayments] = useState([])
  const [records, setRecords] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [paymentNumber, setPaymentNumber] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [recordId, setRecordId] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [showForm, setShowForm] = useState(false)

  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchPayments()
    fetchRecords()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${api}/api/payments`)
      setPayments(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${api}/api/service-records`)
      setRecords(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setPaymentNumber('')
    setAmountPaid('')
    setRecordId('')
    setPaymentDate('')
    setShowForm(false)
  }

  const handleEdit = (payment) => {
    setEditingId(payment._id)
    setPaymentNumber(payment.paymentNumber || '')
    setAmountPaid(payment.amountPaid || '')
    setRecordId(payment.recordId?._id || payment.recordId || '')
    setPaymentDate(payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '')
    setShowForm(true)
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this payment?')) return
    try {
      await axios.delete(`${api}/api/payments/${id}`)
      fetchPayments()
    } catch (err) {
      alert('Failed to delete payment')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      paymentNumber,
      amountPaid,
      recordId,
      paymentDate: paymentDate || new Date()
    }
    try {
      if (editingId) {
        await axios.put(`${api}/api/payments/${editingId}`, payload)
      } else {
        await axios.post(`${api}/api/payments`, payload)
      }
      resetForm()
      fetchPayments()
    } catch (err) {
      alert('Failed to save payment')
    }
  }

  const closeModal = () => {
    resetForm()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-800">Payments</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> Add New Payment
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment List</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">Payment #</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Record</th>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p.paymentNumber}</td>
                <td className="px-4 py-3">{p.amountPaid}</td>
                <td className="px-4 py-3">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">{p.recordId?.recordNumber || '-'}</td>
                <td className="px-4 py-3">{p.recordId?.carId?.plateNumber || '-'}</td>
                <td className="px-4 py-3">{p.recordId?.serviceId?.serviceName || '-'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-6 text-center text-gray-500">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{editingId ? 'Edit Payment' : 'Add Payment'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Number</label>
                <input type="text" value={paymentNumber} onChange={(e) => setPaymentNumber(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount Paid</label>
                <input type="text" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Service Record</label>
                <select 
                  value={recordId} 
                  onChange={(e) => setRecordId(e.target.value)} 
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 appearance-none cursor-pointer" 
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px'}}
                  required
                >
                  <option value="" disabled>Select a record...</option>
                  {records.map((r) => (
                    <option key={r._id} value={r._id}>
                      #{r.recordNumber} - {r.carId?.plateNumber || 'Car'} ({r.serviceId?.serviceName || 'Service'})
                    </option>
                  ))}
                </select>
                {records.length === 0 && <p className="text-xs text-red-500 mt-1">No records available. Please create service records first.</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Date</label>
                <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full mt-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition">{editingId ? 'Update Payment' : 'Add Payment'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
