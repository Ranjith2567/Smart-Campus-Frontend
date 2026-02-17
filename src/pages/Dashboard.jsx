import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserGraduate, 
  FaUserCheck, 
  FaPlus, 
  FaBullhorn,
  FaChartBar,
  FaCheck,
  FaTimes 
} from 'react-icons/fa'; 

import { 
  FaUserLargeSlash, 
  FaRightFromBracket, 
  FaPenToSquare, 
  FaTrashCan 
} from 'react-icons/fa6'; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [notices, setNotices] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [editingNoticeId, setEditingNoticeId] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      if (parsedUser.role === 'student') {
        navigate('/student-dashboard');
      } else {
        fetchStudents(parsedUser.token);
        fetchStats(parsedUser.token);
        fetchNotices(); 
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchStudents = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/users', config);
      setStudents(data);
    } catch (error) { console.error("Data fetch error", error); }
  };

  const fetchStats = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/attendance/stats', config);
      setStats({ present: data.presentCount, absent: data.absentCount });
    } catch (error) { console.error("Stats fetch error", error); }
  };

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notices');
      setNotices(data);
    } catch (error) { console.error("Notice fetch error", error); }
  };

  const markAttendance = async (studentId, status, studentName) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const today = new Date().toISOString().split('T')[0];
      await axios.post('http://localhost:5000/api/attendance', {
        studentId, date: today, status: status
      }, config);
      alert(`${status === 'Present' ? '✅' : '❌'} Marked for ${studentName}`);
      fetchStats(user.token);
    } catch (error) { alert(`⚠️ Already marked or Error!`); }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (editingNoticeId) {
        await axios.put(`http://localhost:5000/api/notices/${editingNoticeId}`, { title: noticeTitle, content: noticeContent }, config);
        alert('Updated! 📝');
      } else {
        await axios.post('http://localhost:5000/api/notices', { title: noticeTitle, content: noticeContent }, config);
        alert('Published! 📢');
      }
      setNoticeTitle(''); setNoticeContent(''); setEditingNoticeId(null);
      fetchNotices();
    } catch (error) { alert('Operation failed.'); }
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm('Delete notice?')) {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/notices/${id}`, config);
      fetchNotices();
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Delete student?')) {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/users/${id}`, config);
      fetchStudents(user.token);
    }
  };

  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const canManage = user?.role === 'admin' || user?.role === 'staff';

  return (
    <div className="container-fluid py-3 py-md-4" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 🚀 RESPONSIVE HEADER */}
      <div className="card border-0 shadow-sm mb-4 p-3 border-start border-primary border-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3 text-center text-md-start">
            <img src={user?.pic} alt="Profile" className="rounded-circle shadow-sm" style={{ width: '50px', height: '50px', border: '2px solid #007bff' }} />
            <div>
              <h6 className="mb-0 fw-bold text-dark">
                {user?.role === 'admin' ? 'Admin Center' : 'Staff Dashboard'}
              </h6>
              <p className="text-muted mb-0 small">Welcome, <strong>{user?.name}</strong></p>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2 w-100 w-md-auto">
            {canManage && (
              <button onClick={() => navigate('/attendance-report')} className="btn btn-light text-primary border fw-bold btn-sm px-3 shadow-sm flex-grow-1 flex-md-grow-0">
                <FaChartBar className="me-1"/> Reports
              </button>
            )}
            <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/'); }} className="btn btn-outline-danger btn-sm px-3 fw-bold shadow-sm flex-grow-1 flex-md-grow-0">
              <FaRightFromBracket className="me-1"/> Logout
            </button>
          </div>
        </div>
      </div>

      {/* 📊 RESPONSIVE STATS (Stacks on mobile) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow h-100 p-3 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="opacity-75">Students</small><h3 className="fw-bold mb-0">{students.length}</h3></div>
              <FaUserGraduate size={30} className="opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow h-100 p-3 text-white" style={{ background: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="opacity-75">Present</small><h3 className="fw-bold mb-0">{stats.present}</h3></div>
              <FaUserCheck size={30} className="opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow h-100 p-3 text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="opacity-75">Absent</small><h3 className="fw-bold mb-0">{stats.absent}</h3></div>
              <FaUserLargeSlash size={30} className="opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* 📢 NOTICES (Stacks on top on mobile) */}
        <div className="col-12 col-lg-5 order-2 order-lg-1">
          {canManage && (
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h6 className="fw-bold text-dark mb-3"><FaBullhorn className="text-primary me-2"/> {editingNoticeId ? 'Edit' : 'Post'} Notice</h6>
              <form onSubmit={handleNoticeSubmit}>
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Subject" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} required />
                <textarea className="form-control form-control-sm mb-3" placeholder="Message..." value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} required rows="3"></textarea>
                <button type="submit" className={`btn btn-sm w-100 fw-bold ${editingNoticeId ? 'btn-info text-white' : 'btn-primary'}`}>{editingNoticeId ? 'Update' : 'Publish'}</button>
              </form>
            </div>
          )}
          <div className="card border-0 shadow-sm p-4 bg-white" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">📌 Bulletin Board</h6>
            {notices.map((n) => (
              <div key={n._id} className="mb-3 p-3 rounded bg-light border-start border-primary border-4">
                <div className="d-flex justify-content-between align-items-start">
                  <span className="fw-bold text-dark small">{n.title}</span>
                  {canManage && (
                    <div className="d-flex gap-2">
                      <FaPenToSquare className="text-primary cursor-pointer" size={14} onClick={() => { setEditingNoticeId(n._id); setNoticeTitle(n.title); setNoticeContent(n.content); }} />
                      <FaTrashCan className="text-danger cursor-pointer" size={14} onClick={() => handleDeleteNotice(n._id)} />
                    </div>
                  )}
                </div>
                <p className="text-muted extra-small mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{n.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🎓 STUDENT REGISTRY */}
        <div className="col-12 col-lg-7 order-1 order-lg-2">
          <div className="card border-0 shadow-sm p-3 p-md-4 bg-white h-100">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-2">
              <h6 className="fw-bold mb-0 text-center text-sm-start">Student Registry</h6>
              <button onClick={() => navigate('/add-student')} className="btn btn-primary btn-sm w-100 w-sm-auto shadow-sm fw-bold">
                <FaPlus size={12} className="me-1" /> New Student
              </button>
            </div>
            <input type="text" className="form-control form-control-sm mb-3" placeholder="🔍 Search Students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="table-responsive">
              <table className="table table-sm table-hover text-center align-middle" style={{ minWidth: '500px' }}>
                <thead className="table-light extra-small text-uppercase">
                  <tr style={{ fontSize: '0.75rem' }}>
                    <th>Name</th>
                    <th>Attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {filteredStudents.map((s) => (
                    <tr key={s._id}>
                      <td className="fw-bold text-start ps-2">{s.name}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button onClick={() => markAttendance(s._id, 'Present', s.name)} className="btn btn-success btn-xs p-1 rounded-circle"><FaCheck size={10} /></button>
                          <button onClick={() => markAttendance(s._id, 'Absent', s.name)} className="btn btn-danger btn-xs p-1 rounded-circle"><FaTimes size={10} /></button>
                        </div>
                      </td>
                      <td>
                        <button onClick={() => navigate(`/edit-student/${s._id}`)} className="btn btn-link btn-sm p-0 me-2"><FaPenToSquare /></button>
                        <button onClick={() => deleteStudent(s._id)} className="btn btn-link btn-sm p-0 text-danger"><FaTrashCan /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;