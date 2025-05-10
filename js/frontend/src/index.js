// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct for React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext.js'; // Only import AuthProvider

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial render
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
