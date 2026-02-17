import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// 📂 Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard'; // 👈 Ippo Active!
import AddStudent from './pages/AddStudent'; 
import EditStudent from './pages/EditStudent'; 
import AttendanceReport from './pages/AttendanceReport';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword'; 

import ProtectedRoute from './Components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* 🔐 Admin & Staff Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* 🎓 Student Dashboard (Active) */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ➕ Add Student (Admin & Staff) - 👇 Teachers-kum access kuduthachu */}
        <Route 
          path="/add-student" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <AddStudent />
            </ProtectedRoute>
          } 
        /> 
        
        {/* 📝 Edit Student (Admin & Staff) - 👇 Teachers-kum access kuduthachu */}
        <Route 
          path="/edit-student/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <EditStudent />
            </ProtectedRoute>
          } 
        /> 

        {/* 📊 Analytics & Reports */}
        <Route 
          path="/attendance-report"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <AttendanceReport />
            </ProtectedRoute>
          } 
        /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;