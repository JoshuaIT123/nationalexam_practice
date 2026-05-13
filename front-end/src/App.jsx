import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Car from "./pages/Car";
import Nav from "./pages/Nav";
import Service from "./pages/Service";
import Report from "./pages/Report";
import ServiceRecord from "./pages/ServiceRecord";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!hideNav && <Nav />}
      <main className={`flex-1 ${!hideNav ? "p-6 overflow-auto" : ""} bg-gray-100 min-h-screen`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cars" element={<Car />} />
          <Route path="/services" element={<Service />} />
          <Route path="/records" element={<ServiceRecord />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/report" element={<Report />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
