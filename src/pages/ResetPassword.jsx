import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaShieldAlt } from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      alert('Password Updated! 🎉 Login now.');
      navigate('/');
    } catch (err) {
      alert("Token expired or Invalid!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 px-2" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="card border-0 shadow-lg p-4 text-center" style={{ maxWidth: '400px', width: '90%', borderRadius: '15px' }}>
        <div className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
          <FaShieldAlt size={25} />
        </div>
        <h4 className="fw-bold">Reset Password</h4>
        <p className="text-muted small mb-4">Choose a strong new password.</p>
        
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><FaLock className="text-success"/></span>
              <input type="password" className="form-control bg-light border-start-0 ps-0 shadow-none" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold py-2">Update Password ✨</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;