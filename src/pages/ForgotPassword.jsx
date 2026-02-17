import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaKey } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://smartcampusmanager.onrender.com/api/users/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      alert("Email not found!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 px-2" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="card border-0 shadow-lg p-4 text-center" style={{ maxWidth: '400px', width: '90%', borderRadius: '15px' }}>
        <div className="bg-light text-primary rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
          <FaKey size={25} />
        </div>
        <h4 className="fw-bold">Forgot Password?</h4>
        <p className="text-muted small mb-4">Enter your email and we'll send a reset link.</p>
        
        {message ? (
          <div className="alert alert-success small">{message}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-primary"/></span>
                <input type="email" className="form-control bg-light border-start-0 ps-0 shadow-none" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3">Send Link 🚀</button>
          </form>
        )}
        
        <Link to="/" className="text-decoration-none small fw-bold text-muted d-flex align-items-center justify-content-center gap-2">
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;