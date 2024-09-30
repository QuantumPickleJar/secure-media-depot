import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

/**
 * PrivateRoute component to protect routes.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render if authenticated.
 * @returns {React.ReactNode} - Rendered component or redirect.
 */
function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);

  return authTokens ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
