/**
 * Login Page JavaScript
 * Handles user authentication and login form submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Redirect to player or home page if already logged in
        window.location.href = '/media/player';
        return;
    }
    
    // Set up form submission event listener
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleLogin();
    });
    
    // Check for redirect parameters (like after registration)
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
        showSuccess(message);
    }
});

/**
 * Handle the login form submission
 */
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showError('Username and password are required');
        return;
    }
    
    // Clear any existing messages
    document.getElementById('error').textContent = '';
    document.getElementById('success').textContent = '';
    
    // Send login request
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showError(data.error);
        } else if (data.token) {
            // Store the token and redirect
            localStorage.setItem('authToken', data.token);
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to the video player or home page
            setTimeout(() => {
                window.location.href = '/media/player';
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during login. Please try again.');
    });
}

/**
 * Display an error message
 */
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    document.getElementById('success').style.display = 'none';
}

/**
 * Display a success message
 */
function showSuccess(message) {
    const successElement = document.getElementById('success');
    successElement.textContent = message;
    successElement.style.display = 'block';
    document.getElementById('error').style.display = 'none';
}