import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserGraduate, 
  FaSignOutAlt, 
  FaBullhorn, 
  FaCalendarCheck, 
  FaTimesCircle, 
  FaListAlt 
} from 'react-icons/fa';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [notices, setNotices] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.role === 'student') {
      setUser(userInfo);
      fetchMyAttendance(userInfo.token);
      fetchNotices(); 
      setLoading(false);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchMyAttendance = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('https://smartcampusmanager.onrender.com/api/attendance/my-attendance', config);
      setAttendance(data);
    } catch (error) { console.error("Attendance Error:", error); }
  };

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get('https://smartcampusmanager.onrender.com/api/notices');
      setNotices(data);
    } catch (error) { console.error("Notice Error:", error); }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const presentCount = attendance ? attendance.filter(a => a.status === 'Present').length : 0;
  const absentCount = attendance ? attendance.filter(a => a.status === 'Absent').length : 0;

  return (
    <div className="container-fluid py-3 py-md-5" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* 🚀 RESPONSIVE HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 px-3 bg-white py-3 shadow-sm rounded border-start border-primary border-4 gap-3">
        <h3 className="text-dark fw-bold d-flex align-items-center gap-2 m-0 fs-4">
          <FaUserGraduate className="text-primary" /> Student Portal
        </h3>
        <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/'); }} className="btn btn-outline-danger btn-sm fw-bold d-flex align-items-center gap-2 w-100 w-md-auto justify-content-center">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="row g-4 px-1">
        
        {/* 👤 PROFILE CARD (Full width on mobile, 4 units on desktop) */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
             <div className="mx-auto mb-3 p-1 border border-3 border-primary rounded-circle" style={{ width: '80px', height: '80px' }}>
                <img 
                  src={user?.pic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                  alt="Profile" 
                  className="rounded-circle w-100 h-100"
                  style={{ objectFit: 'cover' }} 
                />
             </div>
             <h5 className="fw-bold text-dark mb-1">{user?.name}</h5>
             <p className="text-muted small mb-3">{user?.email}</p>
             <span className="badge bg-primary px-3 py-2 rounded-pill mx-auto" style={{ width: 'fit-content' }}>STUDENT ACCOUNT</span>
          </div>
        </div>

        {/* 📊 STATS & NOTICES (Full width on mobile, 8 units on desktop) */}
        <div className="col-12 col-lg-8">
           
           {/* STATS CARDS (Side-by-side even on small screens) */}
           <div className="row g-2 g-md-3 mb-4">
             <div className="col-6">
               <div className="card border-0 shadow-sm p-3 text-white h-100" style={{ background: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)', borderRadius: '12px' }}>
                 <div className="text-center text-md-start">
                   <h6 className="opacity-75 small mb-1">Present</h6>
                   <h3 className="fw-bold mb-0 fs-4">{presentCount}</h3>
                 </div>
               </div>
             </div>
             <div className="col-6">
               <div className="card border-0 shadow-sm p-3 text-white h-100" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', borderRadius: '12px' }}>
                 <div className="text-center text-md-start text-dark">
                   <h6 className="opacity-75 small mb-1">Absent</h6>
                   <h3 className="fw-bold mb-0 fs-4 text-danger">{absentCount}</h3>
                 </div>
               </div>
             </div>
           </div>

           {/* NOTICE BOARD */}
           <div className="card border-0 shadow-sm p-3 p-md-4" style={{ borderRadius: '15px' }}>
             <h5 className="border-bottom pb-3 mb-3 fw-bold d-flex align-items-center gap-2 fs-6 fs-md-5">
               <FaBullhorn className="text-warning" /> Notice Board
             </h5>
             <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
               {notices.length === 0 ? (
                 <p className="text-muted text-center small">No new notices.</p>
               ) : (
                 notices.map(n => (
                   <div key={n._id} className="alert alert-light border-start border-warning border-4 shadow-sm py-2 mb-2">
                     <strong className="d-block text-dark small">{n.title}</strong>
                     <span className="text-muted extra-small" style={{ fontSize: '0.85rem' }}>{n.content}</span>
                   </div>
                 ))
               )}
             </div>
           </div>

        </div>
      </div>
      
      {/* 📅 ATTENDANCE TABLE (Scrollable on mobile) */}
      <div className="row px-1 mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm p-3 p-md-4" style={{ borderRadius: '15px' }}>
             <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 fs-6 fs-md-5">
               <FaListAlt className="text-secondary" /> History
             </h5>
             
             {attendance.length === 0 ? (
               <p className="text-muted small">No records found.</p>
             ) : (
               <div className="table-responsive">
                 <table className="table table-sm table-hover align-middle" style={{ minWidth: '400px' }}>
                   <thead className="table-light">
                     <tr className="small">
                       <th>Date</th>
                       <th>Status</th>
                       <th>Remarks</th>
                     </tr>
                   </thead>
                   <tbody className="small">
                     {attendance.map((record) => (
                       <tr key={record._id}>
                         <td className="text-secondary">{record.date}</td>
                         <td>
                           <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                             {record.status}
                           </span>
                         </td>
                         <td className="text-muted small">
                           {record.status === 'Present' ? 'On Time' : 'Absent'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;