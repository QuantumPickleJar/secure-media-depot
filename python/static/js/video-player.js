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
        const mimeType = item.mimetype || item.mime_type || 'unknown/unknown';
        
        if (item.type === 'video' || (mimeType && mimeType.startsWith('video/'))) {
            iconClass = 'video-icon';
        } else if (mimeType && mimeType.startsWith('audio/')) {
            iconClass = 'audio-icon';
        }
        
        fileItem.innerHTML = `
            <div class="${iconClass}">${item.originalName || item.filename}</div>
            <div class="file-meta">Size: ${formatFileSize(item.size || item.size_bytes)} | Type: ${mimeType}</div>
        `;
        
        fileItem.addEventListener('click', () => {
            document.getElementById('fileId').value = item.id;
            document.getElementById('fileId').setAttribute('data-type', item.type);
            document.getElementById('fileId').setAttribute('data-mimetype', mimeType);
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
    const mimeType = document.getElementById('fileId').getAttribute('data-mimetype') || 'video/mp4';
    const loadingBar = document.getElementById('video-loading-bar');
    const progressBar = document.getElementById('video-progress');
    const loadingText = document.getElementById('video-loading-text');
    
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
    sourceElement.setAttribute('type', mimeType);
    videoPlayer.appendChild(sourceElement);
    
    // Show loading bar
    loadingBar.style.display = 'block';
    progressBar.value = 0;
    loadingText.textContent = 'Loading video...';

    // Listen for progress events
    let lastBuffered = 0;
    function updateProgress() {
        try {
            if (videoPlayer.buffered.length > 0) {
                const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
                const duration = videoPlayer.duration || 1;
                let percent = Math.round((bufferedEnd / duration) * 100);
                if (!isNaN(percent)) {
                    progressBar.value = percent;
                    loadingText.textContent = `Buffering: ${percent}%`;
                }
                lastBuffered = percent;
            }
        } catch (e) {}
    }
    videoPlayer.addEventListener('progress', updateProgress);
    videoPlayer.addEventListener('loadeddata', updateProgress);
    videoPlayer.addEventListener('canplay', function() {
        loadingBar.style.display = 'none';
        progressBar.value = 100;
        loadingText.textContent = '';
        videoPlayer.play().catch(() => {});
    });
    videoPlayer.addEventListener('error', function(e) {
        loadingBar.style.display = 'none';
        progressBar.value = 0;
        loadingText.textContent = '';
        console.error('Video error:', videoPlayer.error);
        const errorMessages = {
            1: 'The fetching of the video was aborted',
            2: 'Network error occurred while loading the video',
            3: 'Error decoding the video',
            4: 'Video not supported'
        };
        let errorMessage = 'Unknown error occurred';
        if (videoPlayer.error && videoPlayer.error.code) {
            errorMessage = errorMessages[videoPlayer.error.code] || errorMessage;
        }
        showError(`Error playing video: ${errorMessage}. Check browser console for details.`);
    });
    videoPlayer.load();
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
    window.location.href = '/media/login';
}