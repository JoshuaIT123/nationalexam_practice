import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Report() {
  const [records, setRecords] = useState([])
  const [payments, setPayments] = useState([])
  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rRes, pRes] = await Promise.all([
        axios.get(`${api}/api/service-records`),
        axios.get(`${api}/api/payments`)
      ])
      setRecords(Array.isArray(rRes.data) ? rRes.data : [])
      setPayments(Array.isArray(pRes.data) ? pRes.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const totalPayments = payments.reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0)

  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()

  const isWithinDays = (date, days) => {
    const now = new Date()
    const d = new Date(date)
    const diff = (now - d) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= days
  }

  const downloadCSV = (filename, headers, rows) => {
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadDaily = () => {
    const today = new Date()
    const dr = records.filter(r => r.serviceDate && isSameDay(new Date(r.serviceDate), today))
    const dp = payments.filter(p => p.paymentDate && isSameDay(new Date(p.paymentDate), today))
    const rRows = dr.map(r => [r.recordNumber, new Date(r.serviceDate).toLocaleDateString(), r.carId?.plateNumber || '-', r.serviceId?.serviceName || '-', r.carId?.model || '-'])
    const pRows = dp.map(p => [p.paymentNumber, p.amountPaid, new Date(p.paymentDate).toLocaleDateString(), p.recordId?.recordNumber || '-', p.recordId?.carId?.plateNumber || '-'])
    downloadCSV(`daily_report_${today.toISOString().split('T')[0]}.csv`, ['Type','Record/Payment #','Date','Car','Service/Amount'], [...rRows.map(r => ['Record',...r]), ...pRows.map(p => ['Payment',...p])])
  }

  const downloadWeekly = () => {
    const today = new Date()
    const wr = records.filter(r => r.serviceDate && isWithinDays(r.serviceDate, 7))
    const wp = payments.filter(p => p.paymentDate && isWithinDays(p.paymentDate, 7))
    const rRows = wr.map(r => [r.recordNumber, new Date(r.serviceDate).toLocaleDateString(), r.carId?.plateNumber || '-', r.serviceId?.serviceName || '-', r.carId?.model || '-'])
    const pRows = wp.map(p => [p.paymentNumber, p.amountPaid, new Date(p.paymentDate).toLocaleDateString(), p.recordId?.recordNumber || '-', p.recordId?.carId?.plateNumber || '-'])
    downloadCSV(`weekly_report_${today.toISOString().split('T')[0]}.csv`, ['Type','Record/Payment #','Date','Car','Service/Amount'], [...rRows.map(r => ['Record',...r]), ...pRows.map(p => ['Payment',...p])])
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-blue-800">Reports</h1>
        <div className="flex gap-3">
          <button onClick={downloadDaily} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">Download Daily</button>
          <button onClick={downloadWeekly} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">Download Weekly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Cars</h3>
          <p className="text-4xl font-bold text-blue-800 mt-2">{records.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Service Records</h3>
          <p className="text-4xl font-bold text-blue-800 mt-2">{records.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Payments</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalPayments.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Service Records Overview</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">Record #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Car (Plate)</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Model</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{r.recordNumber}</td>
                <td className="px-4 py-3">{r.serviceDate ? new Date(r.serviceDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">{r.carId?.plateNumber || '-'}</td>
                <td className="px-4 py-3">{r.serviceId?.serviceName || '-'}</td>
                <td className="px-4 py-3">{r.carId?.model || '-'}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Payments Overview</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">Payment #</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Record #</th>
              <th className="px-4 py-3">Car</th>
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
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Report