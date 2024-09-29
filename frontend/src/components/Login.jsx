import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const [error, setError] = useState('');

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with your actual login API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setAuthTokens(data.token);
      history.push('/files');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div>
    <h2>Login</h2>
    {error && <p style={{color: 'red'}}>{error}</p>}
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
);
}

export default Login;