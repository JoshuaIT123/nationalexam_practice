import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link to="/dashboard" className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg transition">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound