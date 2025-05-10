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
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const fileListElement = document.getElementById('fileList');
    fileListElement.innerHTML = 'Loading files...';
    fetch('/api/videos/list_all', {
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
        console.log('DEBUG: /api/videos/list_all response', data);
        // Accept both {items: [...]} and {videos: [...]} for compatibility
        if (Array.isArray(data.items)) {
            displayFileList(data.items);
        } else if (Array.isArray(data.videos)) {
            displayFileList(data.videos);
        } else {
            fileListElement.innerHTML = 'No files or videos found in response.';
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
function displayFileList(items) {
    const fileListElement = document.getElementById('fileList');
    fileListElement.innerHTML = '';
    items.forEach(item => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        let iconClass = 'file-icon';
        if (item.type === 'video' || (item.mimetype && item.mimetype.startsWith('video/'))) {
            iconClass = 'video-icon';
        } else if (item.mimetype && item.mimetype.startsWith('audio/')) {
            iconClass = 'audio-icon';
        }
        fileItem.innerHTML = `
            <div class="${iconClass}">${item.originalName || item.filename}</div>
            <div class="file-meta">Size: ${formatFileSize(item.size || item.size_bytes)} | Type: ${item.mimetype || item.mime_type || 'Unknown'}</div>
        `;
        fileItem.addEventListener('click', () => {
            document.getElementById('fileId').value = item.id;
            document.getElementById('fileId').setAttribute('data-type', item.type);
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
    const fileType = document.getElementById('fileId').getAttribute('data-type');
    if (!fileId) {
        showError('Please enter a file ID or select a file from the list');
        return;
    }
    const videoPlayer = document.getElementById('videoPlayer');
    let src = '';
    if (fileType === 'video') {
        src = `/api/videos/stream/${fileId}`;
    } else {
        src = `/api/files/${fileId}`;
    }
    // Remove all sources
    while (videoPlayer.firstChild) {
        videoPlayer.removeChild(videoPlayer.firstChild);
    }
    const sourceElement = document.createElement('source');
    sourceElement.src = src;
    sourceElement.setAttribute('type', 'video/mp4');
    videoPlayer.appendChild(sourceElement);
    videoPlayer.load();
    // Optionally, handle token for protected endpoints (if needed)
    // For most browsers, Authorization header on <video> is not supported directly
    // If needed, use XHR/fetch to get blob and set videoPlayer.src = URL.createObjectURL(blob)
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