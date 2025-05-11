// Handles modal open/close and video upload for files.html

document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('upload-btn');
    const uploadModal = document.getElementById('uploadModal');
    const closeUploadModal = document.getElementById('closeUploadModal');
    const videoUploadForm = document.getElementById('videoUploadForm');
    const fileInput = document.getElementById('videoFile');
    const titleInput = document.getElementById('videoTitle');
    const statusDiv = document.getElementById('uploadStatus');

    // Open modal
    uploadBtn.addEventListener('click', function() {
        uploadModal.style.display = 'flex';
    });
    // Close modal
    closeUploadModal.addEventListener('click', function() {
        uploadModal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    // Upload logic
    const progressBar = document.getElementById('upload-progress');

    videoUploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        statusDiv.textContent = '';
        progressBar.style.display = 'none';
        progressBar.value = 0;

        if (!fileInput.files.length) {
            statusDiv.textContent = 'Please select a file.';
            return;
        }

        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('title', titleInput.value);

        statusDiv.textContent = 'Uploading...';
        progressBar.style.display = 'block';

        try {
            const res = await fetch('/api/videos/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            // Simulate progress for demonstration purposes
            const totalSteps = 100;
            for (let i = 0; i <= totalSteps; i++) {
                await new Promise(resolve => setTimeout(resolve, 20)); // Simulate delay
                progressBar.value = i;
            }

            const data = await res.json();
            if (res.ok) {
                statusDiv.textContent = 'Upload successful!';
                fileInput.value = '';
                titleInput.value = '';
                uploadModal.style.display = 'none';
                progressBar.style.display = 'none';
                if (typeof loadFileList === 'function') loadFileList();
            } else {
                statusDiv.textContent = data.error || 'Upload failed.';
                progressBar.style.display = 'none';
            }
        } catch (err) {
            statusDiv.textContent = 'Error uploading file.';
            progressBar.style.display = 'none';
        }
    });
});
