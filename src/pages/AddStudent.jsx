import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserPlus, FaArrowLeft } from 'react-icons/fa';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456'); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'https://smartcampusmanager.onrender.com/api/users', 
        { name, email, password, role: 'student' }, 
        config
      );

      alert('Student record created successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response && error.response.data.message 
                  ? error.response.data.message 
                  : "Access denied. Insufficient privileges.";
      alert(`Error: ${msg}`);
      setLoading(false);
    }
  };

  return (
    // 👇 min-vh-100 and py-4 sethurukkaen for mobile scroll
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-4 px-2" style={{ backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* 👇 Responsive Width: Max 420px, but 90% on smaller screens */}
      <div className="card border-0 shadow-lg p-3 p-md-4" style={{ maxWidth: '420px', width: '90%', margin: 'auto', borderRadius: '15px' }}>
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '55px', height: '55px' }}>
            <FaUserPlus size={24} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Enroll Student</h5>
          <p className="text-muted extra-small" style={{ fontSize: '0.85rem' }}>Enter details to register</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaUser className="text-primary" size={14}/></span>
              <input 
                type="text" 
                className="form-control bg-light border-start-0 ps-0 shadow-none"
                placeholder="Ex: John Doe"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label className="form-label fw-bold small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-primary" size={14}/></span>
              <input 
                type="email" 
                className="form-control bg-light border-start-0 ps-0 shadow-none"
                placeholder="student@college.edu"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Action Buttons (Stacked on mobile for better touch target) */}
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary fw-bold shadow-sm py-2"
              disabled={loading}
            >
              {loading ? 'Processing...' : <><FaUserPlus className="me-2" /> Confirm Enrollment</>}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-outline-secondary fw-bold border-0 btn-sm"
            >
              <FaArrowLeft className="me-2" /> Return to Dashboard
            </button>
          </div>
        </form>

        <div className="mt-4 text-center border-top pt-3">
          <p className="text-muted extra-small mb-0" style={{ fontSize: '0.75rem' }}>
            <span className="text-danger">*</span> Default password <strong>'123456'</strong> will be assigned.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;