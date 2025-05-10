/**
 * Register Page JavaScript
 * Handles user registration and form submission
 */

// Check if the user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    if (token) {
        document.getElementById('success').textContent = 'You are already logged in!';
        document.getElementById('success').style.display = 'block';
        
        // Add a logout option
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.marginTop = '10px';
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('authToken');
            window.location.reload();
        });
        document.getElementById('success').appendChild(document.createElement('br'));
        document.getElementById('success').appendChild(logoutBtn);
        
        // Hide the form
        document.getElementById('registerForm').style.display = 'none';
    }
});

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const adminCode = document.getElementById('adminCode').value.trim();
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    
    // Reset notifications
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Build registration data
    const registrationData = {
        username,
        email,
        password
    };
    
    // Only include adminCode if it's provided
    if (adminCode) {
        registrationData.adminCode = adminCode;
    }
    
    // Make registration API request
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Registration failed. Please try again.');
            });
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        successDiv.textContent = 'Registration successful! Redirecting to login...';
        if (data.user && data.user.is_admin === 0 && data.user.is_approved === 0) {
            successDiv.textContent = 'Registration submitted! Your account requires admin approval before you can log in.';
        }
        successDiv.style.display = 'block';
        
        // Redirect to login after a brief delay unless approval is pending
        if (data.user && (data.user.is_approved === 1 || data.user.is_admin === 1)) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    })
    .catch(error => {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    });
});