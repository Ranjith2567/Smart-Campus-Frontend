import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaFileCsv, FaFilter, FaArrowLeft, FaCalendarAlt, FaTable } from 'react-icons/fa';

const AttendanceReport = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        params: { startDate, endDate }
      };

      const { data } = await axios.get('http://localhost:5000/api/attendance', config);
      setReports(data);
    } catch (error) {
      console.error("Critical: Failed to retrieve attendance records.", error);
    }
  };

  const downloadCSV = () => {
    if (reports.length === 0) {
      alert("⚠️ No records found to export.");
      return;
    }
    const headers = ["Date", "Student Name", "Email", "Attendance Status"];
    const csvRows = reports.map(record => [
      record.date,
      record.studentId?.name || 'N/A',
      record.studentId?.email || 'N/A',
      record.status
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('hidden', '');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', `Attendance_Report.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container-fluid py-3 py-md-5" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* 📊 RESPONSIVE HEADER */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 px-2 gap-3">
        <h3 className="fw-bold text-dark d-flex align-items-center gap-2 m-0 fs-4 text-center">
          <FaTable className="text-primary" /> Attendance Reports
        </h3>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm fw-bold shadow-sm d-flex align-items-center gap-2 w-100 w-sm-auto justify-content-center">
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* 🛠️ CONTROL PANEL (Date Filters & Buttons) */}
      <div className="card border-0 shadow-sm p-3 p-md-4 mb-4" style={{ borderRadius: '15px' }}>
        <h6 className="fw-bold text-muted mb-3 small"><FaFilter className="me-2"/> Filter Options</h6>
        
        <div className="row g-3">
          {/* Start Date */}
          <div className="col-12 col-md-3">
            <label className="form-label extra-small fw-bold text-muted mb-1">Start Date</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><FaCalendarAlt className="text-primary"/></span>
              <input type="date" className="form-control bg-light border-start-0" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>

          {/* End Date */}
          <div className="col-12 col-md-3">
            <label className="form-label extra-small fw-bold text-muted mb-1">End Date</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0"><FaCalendarAlt className="text-primary"/></span>
              <input type="date" className="form-control bg-light border-start-0" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Action Buttons (Stacked on mobile) */}
          <div className="col-12 col-md-6 d-flex flex-column flex-sm-row gap-2 align-items-end justify-content-end">
            <button onClick={fetchReports} className="btn btn-primary btn-sm fw-bold w-100 shadow-sm py-2">
              <FaFilter className="me-1" /> Apply Filter
            </button>
            <button onClick={downloadCSV} className="btn btn-success btn-sm fw-bold w-100 shadow-sm py-2">
              <FaFileCsv className="me-1" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* 📋 DATA TABLE (Horizontal scroll fixed) */}
      <div className="card border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="table-responsive">
          {/* Min-width helps prevent content squeezing on mobile */}
          <table className="table table-hover align-middle mb-0 text-center" style={{ minWidth: '600px' }}>
            <thead className="bg-light text-secondary text-uppercase extra-small">
              <tr style={{ fontSize: '0.75rem' }}>
                <th className="py-3">Date</th>
                <th className="py-3">Student Name</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-5 text-muted">
                    <div className="d-flex flex-column align-items-center opacity-50">
                      <FaTable size={40} className="mb-2" />
                      <span>No records found for this period.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((record) => (
                  <tr key={record._id}>
                    <td className="text-muted small">{record.date}</td>
                    <td className="text-dark fw-bold">
                      {record.studentId?.name || <span className="text-danger small italic">Deleted User</span>}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.7rem' }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AttendanceReport;