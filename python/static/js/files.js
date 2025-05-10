// Main JavaScript for the files.html page
let currentPage = 1;
let totalPages = 1;
const perPage = 20;

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Load the file list on page load
    loadFileList();
    
    // Add event listener for logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
    });
    
    // Add event listener for search input (pressing Enter)
    document.getElementById('search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchFiles();
        }
    });

    // Add event listener for refresh button
    document.getElementById('refresh-btn').addEventListener('click', function() {
        loadFileList();
    });

    // Add event listeners for pagination buttons
    document.getElementById('prev-page-btn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadFileList();
        }
    });
    document.getElementById('next-page-btn').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadFileList();
        }
    });
});

// Expose functions globally
window.checkAuthStatus = checkAuthStatus;
window.loadFileList = loadFileList;

// Modal open/close logic
document.getElementById('openUploadModal').onclick = function() {
  document.getElementById('uploadModal').style.display = 'flex';
};
document.getElementById('closeUploadModal').onclick = function() {
  document.getElementById('uploadModal').style.display = 'none';
};
window.onclick = function(event) {
  if (event.target == document.getElementById('uploadModal')) {
    document.getElementById('uploadModal').style.display = 'none';
  }
};

/**
 * Check if the user is authenticated
 */
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const authWarning = document.getElementById('auth-warning');
    
    if (!token) {
        authWarning.style.display = 'block';
    } else {
        authWarning.style.display = 'none';
    }
}

/**
 * Load the file and video list from the unified API
 */
function loadFileList() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const fileList = document.getElementById('fileList');
    
    // Show loading state
    fileList.innerHTML = 'Loading...';
    
    fetch(`/api/videos/list_all?page=${currentPage}&per_page=${perPage}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('DEBUG: /api/videos/list_all response', data);
        // Support both {items: [...]} and {videos: [...]} for compatibility
        if (Array.isArray(data.items)) {
            displayFiles(data.items);
            updatePaginationControls(data.page, data.total_items);
        } else if (Array.isArray(data.videos)) {
            displayFiles(data.videos);
            updatePaginationControls(data.page, data.total_items);
        } else {
            fileList.innerHTML = '<div class="error">No files or videos found in response.</div>';
        }
    })
    .catch(error => {
        console.error('Error loading files:', error);
        fileList.innerHTML = `<div class="error">Error loading file list: ${error.message}</div>`;
    });
}

/**
 * Update pagination controls
 */
function updatePaginationControls(page, totalItems) {
    const pageIndicator = document.getElementById('page-indicator');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    totalPages = Math.ceil(totalItems / perPage) || 1;
    pageIndicator.textContent = `Page ${page} of ${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
}

/**
 * Search for files using the API
 */
function searchFiles() {
    const token = localStorage.getItem('token');
    const searchQuery = document.getElementById('search').value.trim();
    const fileList = document.getElementById('fileList');
    
    // Show loading state
    fileList.innerHTML = 'Searching...';
    
    // If search query is empty, load all files
    if (!searchQuery) {
        loadFileList();
        return;
    }
    
    fetch(`/api/files/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayFiles(data.results);
    })
    .catch(error => {
        console.error('Error searching files:', error);
        fileList.innerHTML = `<div class="error">Error searching files: ${error.message}</div>`;
    });
}

/**
 * Display the file list in the UI
 */
function displayFiles(files) {
    const fileList = document.getElementById('fileList');
    
    // Clear the file list
    fileList.innerHTML = '';
    
    if (!files || files.length === 0) {
        fileList.innerHTML = 'No files found.';
        return;
    }
    
    // Create a list of files
    const ul = document.createElement('ul');
    ul.className = 'file-items';
    
    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        // Use icons for type
        let icon = '';
        if (file.type === 'video' || (file.mimetype && file.mimetype.startsWith('video/'))) {
            icon = '<span class="file-icon">🎬</span>';
        } else {
            icon = '<span class="file-icon">📄</span>';
        }
        
        // Only show Play for video files
        let actions = '';
        if (file.type === 'video' || (file.mimetype && file.mimetype.startsWith('video/'))) {
            actions += `<button onclick="playFile(${file.id})">Play</button>`;
        }
        actions += `<button onclick="deleteFile(${file.id}, '${file.filename}')" class="delete-btn">Delete</button>`;
        
        // Create content for list item
        li.innerHTML = `
            <div class="file-info">
                ${icon}
                <span class="file-name">${file.originalName || file.filename}</span>
                <span class="file-type">${file.mimetype || 'Unknown type'}</span>
            </div>
            <div class="file-actions">
                ${actions}
            </div>
        `;
        
        ul.appendChild(li);
    });
    
    fileList.appendChild(ul);
}

/**
 * Open the video player with the selected file
 */
function playFile(fileId) {
    window.location.href = `/player?id=${fileId}`;
}

/**
 * Download a file
 */
function downloadFile(fileId) {
    const token = localStorage.getItem('token');
    
    // Create a hidden iframe for downloading
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `/api/files/${fileId}?token=${token}`;
    document.body.appendChild(iframe);
    
    // Remove the iframe after download starts
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 2000);
}

/**
 * Delete a file
 */
function deleteFile(fileId, fileName) {
    const token = localStorage.getItem('token');
    
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
        return;
    }
    
    fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        const successElement = document.getElementById('success');
        successElement.textContent = 'File deleted successfully';
        successElement.style.display = 'block';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
        
        // Reload the file list
        loadFileList();
    })
    .catch(error => {
        console.error('Error deleting file:', error);
        
        // Show error message
        const errorElement = document.getElementById('error');
        errorElement.textContent = `Error deleting file: ${error.message}`;
        errorElement.style.display = 'block';
        
        // Hide error message after 3 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    });
}

/**
 * Logout the user
 */
function logout() {
    // Clear the token from local storage
    localStorage.removeItem('token');
    
    // Redirect to the login page
    window.location.href = '/login';
}