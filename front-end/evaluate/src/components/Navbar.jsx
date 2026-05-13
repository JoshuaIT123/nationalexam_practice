import { NavLink, useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
      isActive ? "bg-white text-blue-600 shadow" : "text-white hover:bg-white/20"
    }`

  return (
    <nav className="bg-blue-600 shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-white font-bold text-lg">EMS</span>
        <div className="flex gap-2">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/employee" className={linkClass}>Employee</NavLink>
          <NavLink to="/department" className={linkClass}>Department</NavLink>
          <NavLink to="/salary" className={linkClass}>Salary</NavLink>
          <NavLink to="/reports" className={linkClass}>Reports</NavLink>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar
