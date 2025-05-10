/**
 * Home Page JavaScript
 * Handles auth status display and logout functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const loggedInStatus = document.getElementById('logged-in-status');
    const loggedOutStatus = document.getElementById('logged-out-status');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (token) {
        loggedInStatus.style.display = 'block';
    } else {
        loggedOutStatus.style.display = 'block';
    }
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('authToken');
        window.location.reload();
    });
});