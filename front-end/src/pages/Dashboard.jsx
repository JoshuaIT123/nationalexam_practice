import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServices: 0,
    totalRecords: 0,
    totalPayments: 0
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    loadData();

    // Refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Refresh when window gets focus
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadData = () => {
    fetchStats();
    fetchRecentRecords();
    fetchRecentPayments();
  };

  const fetchStats = async () => {
    try {
      const [cars, services, records, payments] = await Promise.all([
        axios.get(`${api}/api/cars`),
        axios.get(`${api}/api/services`),
        axios.get(`${api}/api/service-records`),
        axios.get(`${api}/api/payments`)
      ]);
      setStats({
        totalCars: cars.data.length,
        totalServices: services.data.length,
        totalRecords: records.data.length,
        totalPayments: payments.data.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentRecords = async () => {
    try {
      const res = await axios.get(`${api}/api/service-records?limit=5`);
      setRecentRecords(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const res = await axios.get(`${api}/api/payments?limit=5`);
      setRecentPayments(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
        <button
          onClick={loadData}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
          title="Refresh data"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/cars" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Cars</p>
              <p className="text-3xl font-bold text-blue-800">{stats.totalCars}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/services" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Services</p>
              <p className="text-3xl font-bold text-blue-800">{stats.totalServices}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/records" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Records</p>
              <p className="text-3xl font-bold text-blue-800">{stats.totalRecords}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/payments" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Payments</p>
              <p className="text-3xl font-bold text-blue-800">{stats.totalPayments}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Records */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Service Records</h2>
            <Link to="/records" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {recentRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent records</p>
            ) : (
              recentRecords.map((record) => (
                <Link 
                  key={record._id} 
                  to="/records"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-800">#{record.recordNumber}</p>
                    <p className="text-sm text-gray-500">{record.carId?.plateNumber || 'Car'} - {record.serviceId?.serviceName || 'Service'}</p>
                  </div>
                  <span className="text-sm text-gray-500">{record.serviceDate ? new Date(record.serviceDate).toLocaleDateString() : '-'}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Payments</h2>
            <Link to="/payments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent payments</p>
            ) : (
              recentPayments.map((payment) => (
                <Link 
                  key={payment._id} 
                  to="/payments"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-800">#{payment.paymentNumber}</p>
                    <p className="text-sm text-gray-500">{payment.recordId?.carId?.plateNumber || 'Car'}</p>
                  </div>
                  <span className="font-semibold text-blue-600">{payment.amountPaid} RWF</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
