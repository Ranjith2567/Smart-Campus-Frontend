import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserGraduate, FaUserPlus } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('https://smartcampusmanager.onrender.com/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      if (res.data.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard'); 
      }

    } catch (error) {
      alert('❌ Login Failed! Please check your Email & Password.');
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 px-2" style={{ backgroundColor: '#f0f2f5', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* 👇 MODIFIED THIS LINE: Added width: '90%' and margin: 'auto' */}
      <div className="card border-0 shadow-lg p-4" style={{ maxWidth: '400px', width: '90%', margin: 'auto', borderRadius: '15px' }}>
        
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '65px', height: '65px' }}>
            <FaUserGraduate size={28} />
          </div>
          <h3 className="fw-bold text-dark fs-4">Welcome Back</h3>
          <p className="text-muted small">Sign in to access your portal</p>
        </div>
        
        <form onSubmit={handleLogin}>
          
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-primary"/></span>
              <input 
                type="email" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                placeholder="admin@college.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div className="mb-2">
            <label className="form-label fw-bold small text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaLock className="text-primary"/></span>
              <input 
                type="password" 
                className="form-control bg-light border-start-0 ps-0 shadow-none" 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="text-end mb-4">
            <Link to="/forgot-password" style={{ fontSize: '0.8rem' }} className="text-decoration-none fw-bold text-muted hover-link">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-bold shadow-sm py-2 mb-3"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : <><FaSignInAlt className="me-2"/> Secure Login</>}
          </button>

        </form>

        <div className="text-center border-top pt-3 mt-2">
          <p className="small text-muted mb-0">
            Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none d-block d-sm-inline mt-1 mt-sm-0"><FaUserPlus className="me-1"/> Create Account</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;