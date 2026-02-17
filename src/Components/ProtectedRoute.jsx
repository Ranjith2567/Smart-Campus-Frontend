import { Navigate } from 'react-router-dom';

/**
 * @desc    A reusable component to protect routes based on authentication and user roles.
 * @param   {Array} allowedRoles - An array of roles permitted to access the route (e.g., ['admin', 'staff']).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Retrieve and parse user data from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 1. Check if user is logged in
  if (!userInfo) {
    return <Navigate to="/" />;
  }

  // 2. Check if the user's role is authorized for this specific route
  // If allowedRoles is provided and user's role isn't in it, redirect them
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Redirect students trying to access admin pages to their own dashboard
    return userInfo.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/student-dashboard" />;
  }

  // If all checks pass, render the child component
  return children;
};

export default ProtectedRoute;