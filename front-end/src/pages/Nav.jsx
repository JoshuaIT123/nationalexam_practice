import { Link, useNavigate, useLocation } from 'react-router-dom'

function Nav() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/cars', label: 'Cars' },
    { path: '/services', label: 'Services' },
    { path: '/records', label: 'Records' },
    { path: '/payments', label: 'Payments' },
    { path: '/report', label: 'Report' },
  ]

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold tracking-wide">CRPMS</h1>
        <p className="text-blue-300 text-sm mt-1">Car Repair System</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-blue-800">
          <div className="mb-4">
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-blue-400">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
          >
            Logout
          </button>
      </div>
    </aside>
  )
}

export default Nav
