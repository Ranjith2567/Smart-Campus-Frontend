import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaKey, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState(''); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/users', { 
        name, 
        email, 
        password,
        secretKey 
      });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Account registered successfully! 🎉');
      
      if (data.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    // 👇 min-vh-100 and py-4 sethurukkaen (Mobile-la form cut aagama irukka)
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-4 px-2" style={{ backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* 👇 Style modification: width 90% and margin auto */}
      <div className="card border-0 shadow-lg p-4" style={{ maxWidth: '450px', width: '90%', margin: 'auto', borderRadius: '15px' }}>
        
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
            <FaUserPlus size={24} />
          </div>
          <h3 className="fw-bold text-dark fs-4">Create Account</h3>
          <p className="text-muted small">Join the SmartCampusManager network.</p>
        </div>
        
        <form onSubmit={handleRegister}>
          
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaUser className="text-primary"/></span>
              <input 
                type="text" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                placeholder="e.g. John Doe"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-primary"/></span>
              <input 
                type="email" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                placeholder="name@college.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaLock className="text-primary"/></span>
              <input 
                type="password" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                placeholder="Strong password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-muted">Authorization Key (Optional)</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaKey className="text-warning"/></span>
              <input 
                type="text" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                placeholder="TEACHER or ADMIN" 
                value={secretKey} 
                onChange={(e) => setSecretKey(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-bold shadow-sm py-2 mb-3"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up 🚀'}
          </button>

        </form>

        <div className="text-center border-top pt-3">
          <p className="small text-muted mb-0">
            Already registered? <Link to="/" className="text-primary fw-bold text-decoration-none d-block d-sm-inline mt-1 mt-sm-0"><FaSignInAlt className="me-1"/> Login here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;