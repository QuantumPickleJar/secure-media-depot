// boolean flag to prevent parallel uploads
if (typeof uploadInProgress === 'undefined') {
  var uploadInProgress = false;
}

// grab form, file input, and the new progress bar
const uploadForm    = document.getElementById('upload-form');
const fileInput     = document.getElementById('file-input');
const progressBar   = document.getElementById('upload-progress');

/**
 * startUpload(file: File) 
 * @param {*} file the File object from your input
 * @returns {Promise} Returns a promise that resolves on HTTP 2xx, rejects otherwise.
 */
function startUpload(file) {
  return new Promise((resolve, reject) => {
    // Note: Fetch API doesn’t expose upload progress yet; we use XMLHttpRequest.
    // Future: Streams API may add fetch() upload-progress support.
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/files', true);

    // send JWT
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

    // Listen to the upload’s progress event
    // evt: ProgressEvent – has loaded & total bytes
    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const pct = Math.round(evt.loaded / evt.total * 100);
        progressBar.value = pct;
      }
    });

    xhr.onloadstart = () => {
      uploadInProgress = true;
      progressBar.style.display = 'block';
    };

    xhr.onloadend = () => {
      uploadInProgress = false;
      // hide after a short pause so 100% is visible
      setTimeout(() => progressBar.style.display = 'none', 300);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));

    // build the form data
    const formData = new FormData();
    formData.append('file', file);

    xhr.send(formData);
  });
}

// Prevent closing the tab/window mid-upload
window.addEventListener('beforeunload', (e) => {
  if (uploadInProgress) {
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = 'Upload in progress — are you sure?';
  }
});

// Hook the form submit
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (uploadInProgress) return;             // block multiple uploads
  const file = fileInput.files[0];
  if (!file) return alert('Please pick a file first');

  try {
    const result = await startUpload(file);
    console.log('Upload success:', result);
    // refresh your file-list, close modal, etc.
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
