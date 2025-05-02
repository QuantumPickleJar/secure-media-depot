/**
 * Video Player JavaScript
 * Handles file listing, video playback, and authentication checking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();
    
    // Load the file list
    loadFileList();
    
    // Set up logout button event listener
    document.getElementById('logout-btn').addEventListener('click', logout);
});

/**
 * Check if the user is authenticated
 */
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        document.getElementById('auth-warning').style.display = 'block';
    } else {
        document.getElementById('auth-warning').style.display = 'none';
    }
}

/**
 * Load the list of available files
 */
function loadFileList() {
    const token = localStorage.getItem('authToken');
    const fileListElement = document.getElementById('fileList');
    
    // Show loading message
    fileListElement.innerHTML = 'Loading files...';
    
    fetch('/api/files/list', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load files');
        }
        return response.json();
    })
    .then(data => {
        if (data.files && data.files.length > 0) {
            displayFileList(data.files);
        } else {
            fileListElement.innerHTML = 'No files available.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        fileListElement.innerHTML = 'Error loading files. Please check your authentication.';
    });
}

/**
 * Display the file list in the DOM
 */
function displayFileList(files) {
    const fileListElement = document.getElementById('fileList');
    fileListElement.innerHTML = '';
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Determine the icon based on mimetype
        let iconClass = 'file-icon';
        if (file.mimetype && file.mimetype.startsWith('video/')) {
            iconClass = 'video-icon';
        } else if (file.mimetype && file.mimetype.startsWith('audio/')) {
            iconClass = 'audio-icon';
        }
        
        // Create the file item content
        fileItem.innerHTML = `
            <div class="${iconClass}">${file.filename}</div>
            <div class="file-meta">Size: ${formatFileSize(file.size)} | Type: ${file.mimetype || 'Unknown'}</div>
        `;
        
        // Add click event to play the video
        fileItem.addEventListener('click', () => {
            document.getElementById('fileId').value = file.id;
            loadVideo();
        });
        
        fileListElement.appendChild(fileItem);
    });
}

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

/**
 * Load a video by ID
 */
function loadVideo() {
    const token = localStorage.getItem('authToken');
    const fileId = document.getElementById('fileId').value;
    
    if (!fileId) {
        showError('Please enter a file ID or select a file from the list');
        return;
    }
    
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = `/api/files/${fileId}`;
    videoPlayer.setAttribute('type', 'video/mp4'); // Default, will be overridden by server
    
    // Add token to video source
    const sourceElement = document.createElement('source');
    sourceElement.src = `/api/files/${fileId}`;
    sourceElement.setAttribute('type', 'video/mp4');
    
    // Clear any existing sources and append the new one
    while (videoPlayer.firstChild) {
        videoPlayer.removeChild(videoPlayer.firstChild);
    }
    videoPlayer.appendChild(sourceElement);
    
    videoPlayer.load();
    
    // Add authorization header to video requests
    videoPlayer.addEventListener('loadstart', function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', sourceElement.src);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (this.status === 200) {
                const blob = new Blob([this.response], { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                videoPlayer.src = url;
                videoPlayer.play();
            }
        };
        xhr.send();
    });
}

/**
 * Display an error message
 */
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Handle logout
 */
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
}