import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUserEdit, FaEnvelope, FaSave, FaArrowLeft, FaUser } from 'react-icons/fa';

const EditStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await axios.get('http://localhost:5000/api/users', config);
        const student = data.find(s => s._id === id);
        if (student) {
          setName(student.name);
          setEmail(student.email);
        }
      } catch (err) {
        console.error("Error fetching student details", err);
      }
    };
    fetchStudent();
  }, [id]);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put(`http://localhost:5000/api/users/${id}`, { name, email }, config);
      alert('Student Updated Successfully! ✨');
      navigate('/dashboard');
    } catch (error) {
      alert('❌ Error updating student.');
      setLoading(false);
    }
  };

  return (
    // 👇 min-vh-100 and py-4 for mobile-friendly scrolling
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-4 px-2" style={{ backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* 👇 Optimized Card Width: 90% on mobile, 420px max on laptop */}
      <div className="card border-0 shadow-lg p-3 p-md-4" style={{ maxWidth: '420px', width: '90%', margin: 'auto', borderRadius: '15px' }}>
        
        {/* 📝 Header Section */}
        <div className="text-center mb-4">
          <div className="bg-warning text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
            <FaUserEdit size={26} />
          </div>
          <h4 className="fw-bold text-dark fs-4">Edit Profile</h4>
          <p className="text-muted extra-small" style={{ fontSize: '0.85rem' }}>Update student information below.</p>
        </div>
        
        <form onSubmit={handleUpdate}>
          
          {/* 👤 Name Input */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaUser className="text-warning" size={14}/></span>
              <input 
                type="text" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* 📧 Email Input */}
          <div className="mb-4">
            <label className="form-label fw-bold small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-warning" size={14}/></span>
              <input 
                type="email" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* 🚀 Action Buttons (Stacked on mobile) */}
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-warning text-white fw-bold shadow-sm py-2"
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : <><FaSave className="me-2"/> Update Profile</>}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-outline-secondary btn-sm fw-bold border-0"
            >
              <FaArrowLeft className="me-2"/> Cancel & Return
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditStudent;