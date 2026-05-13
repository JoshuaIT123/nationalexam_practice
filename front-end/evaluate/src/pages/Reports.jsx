import Navbar from '../components/Navbar'

const Reports = () => {
  const handleDownload = (url) => {
    window.open(url, '_blank')
  }

  const reportCards = [
    {
      title: 'Employee Report',
      desc: 'Download detailed employee list with all personal and job information in Excel format.',
      url: 'http://localhost:4000/api/employee/report',
      bg: 'bg-blue-600 hover:bg-blue-700',
      titleColor: 'text-blue-600'
    },
    {
      title: 'Department Report',
      desc: 'Download department list with department codes, names, and gross salary data.',
      url: 'http://localhost:4000/api/department/report',
      bg: 'bg-green-600 hover:bg-green-700',
      titleColor: 'text-green-600'
    },
    {
      title: 'Salary Report',
      desc: 'Download salary report with gross salary, total deduction, net salary, and department details.',
      url: 'http://localhost:4000/api/salary/report',
      bg: 'bg-purple-600 hover:bg-purple-700',
      titleColor: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-sm text-gray-500">Download Excel reports for employees, departments, and salary records.</p>

        <div className="grid grid-cols-3 gap-6">
          {reportCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
              <div>
                <h2 className={`text-lg font-bold ${card.titleColor}`}>{card.title}</h2>
                <p className="text-sm text-gray-500 mt-2">{card.desc}</p>
              </div>
              <button
                onClick={() => handleDownload(card.url)}
                className={`${card.bg} text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-200 self-start`}
              >
                Download Excel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
