import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';

/**
 * Renders a login form component.
 *
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The login form component.
 */
function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthTokens } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setAuthTokens(data.token);
          props.history.push('/files');
        } else {
          // Handle error
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}

export default Login;