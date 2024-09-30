import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider component to wrap around the app and provide authentication context.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} AuthProvider component.
 */
export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() => {
    const token = localStorage.getItem('tokens');
    return token ? JSON.parse(token) : null;
  });

  const logOut = () => {
    localStorage.removeItem('tokens');
    setAuthTokens(null);
  };

  useEffect(() => {
    if (authTokens) {
      localStorage.setItem('tokens', JSON.stringify(authTokens));
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
