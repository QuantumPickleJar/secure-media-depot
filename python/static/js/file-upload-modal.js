// Handles modal open/close and video upload for files.html

let uploadInProgress = false;

document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('upload-btn');
    const uploadModal = document.getElementById('uploadModal');
    const closeUploadModal = document.getElementById('closeUploadModal');
    const videoUploadForm = document.getElementById('videoUploadForm');
    const fileInput = document.getElementById('videoFile');
    const titleInput = document.getElementById('videoTitle');
    const statusDiv = document.getElementById('uploadStatus');
    const progressBar = document.getElementById('upload-progress');
    const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');

    // Open modal
    uploadBtn.addEventListener('click', function() {
        if (!uploadInProgress) uploadModal.style.display = 'flex';
    });
    // Close modal
    closeUploadModal.addEventListener('click', function() {
        if (!uploadInProgress) uploadModal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === uploadModal && !uploadInProgress) {
            uploadModal.style.display = 'none';
        }
    });

    // Upload logic using XMLHttpRequest for real progress
    videoUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (uploadInProgress) return;
        statusDiv.textContent = '';
        progressBar.style.display = 'none';
        progressBar.value = 0;

        if (!fileInput.files.length) {
            statusDiv.textContent = 'Please select a file.';
            return;
        }
        if (!titleInput.value.trim()) {
            statusDiv.textContent = 'Please enter a title.';
            return;
        }

        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('title', titleInput.value);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/videos/upload', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);

        xhr.upload.addEventListener('progress', (evt) => {
            if (evt.lengthComputable) {
                progressBar.style.display = 'block';
                progressBar.value = Math.round((evt.loaded / evt.total) * 100);
            }
        });
        xhr.onloadstart = () => {
            uploadInProgress = true;
            uploadSubmitBtn.disabled = true;
            progressBar.value = 0;
            progressBar.style.display = 'block';
        };
        xhr.onloadend = () => {
            uploadInProgress = false;
            uploadSubmitBtn.disabled = false;
            setTimeout(() => progressBar.style.display = 'none', 500);
        };
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let errorMsg = '';
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        statusDiv.textContent = 'Upload successful!';
                        fileInput.value = '';
                        titleInput.value = '';
                        setTimeout(() => {
                            uploadModal.style.display = 'none';
                            statusDiv.textContent = '';
                            if (typeof loadFileList === 'function') loadFileList();
                        }, 800);
                    } else {
                        errorMsg = data.error || 'Upload failed.';
                    }
                } catch (err) {
                    errorMsg = 'Upload failed. Server did not return JSON.';
                }
                if (xhr.status < 200 || xhr.status >= 300) {
                    errorMsg += ` (HTTP ${xhr.status} ${xhr.statusText})`;
                    if (xhr.responseText) errorMsg += `\nResponse: ${xhr.responseText}`;
                    alert(errorMsg); // Show in alert box for debugging
                    statusDiv.textContent = errorMsg;
                }
            }
        };
        xhr.onerror = function() {
            alert('Network error or server unreachable.');
            statusDiv.textContent = 'Error uploading file.';
        };
        xhr.ontimeout = function() {
            alert('Upload timed out.');
            statusDiv.textContent = 'Upload timed out.';
        };
        xhr.timeout = 10 * 60 * 1000; // 10 minutes
        xhr.send(formData);
    });

    // Prevent closing the tab/window mid-upload
    window.addEventListener('beforeunload', (e) => {
        if (uploadInProgress) {
            e.preventDefault();
            e.returnValue = 'Upload in progress — are you sure?';
        }
    });
});
