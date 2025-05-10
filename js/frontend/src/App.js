import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Upload from './components/Upload';
import Files from './components/File';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

/**
 * Renders the main application element.
 *
 * @returns {JSX.Element} The rendered App element.
 */
function App() {
  const { authTokens, logOut } = useContext(AuthContext);

  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
        {authTokens ? (
          <>
            <Link to="/upload" style={{ margin: '0 10px' }}>Upload</Link>
            <Link to="/files" style={{ margin: '0 10px' }}>Files</Link>
            <button onClick={logOut} style={{ margin: '0 10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
            <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
          </>
        )}
      </nav>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            }
          />
          <Route
            path="/files"
            element={
              <PrivateRoute>
                <Files />
              </PrivateRoute>
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
