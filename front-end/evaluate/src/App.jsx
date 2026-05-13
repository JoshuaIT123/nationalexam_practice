import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Loginform.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Employee from "./pages/Employee.jsx"
import Department from "./pages/Department.jsx"
import Salary from "./pages/Salary.jsx"
import Reports from "./pages/Reports.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/department" element={<Department />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
