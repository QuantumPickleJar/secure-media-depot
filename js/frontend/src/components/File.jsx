import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import MediaItem from './MediaItem.jsx'; // You'll create this next

function Files() {
  const { authTokens } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files', {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFiles(data);
        } else {
          setError(data.message || 'Failed to fetch files.');
        }
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('An error occurred while fetching files.');
      }
    };

    fetchFiles();
  }, [authTokens]);

  return (
    <div>
      <h2>Your Files</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="gallery">
        {files.length > 0 ? (
          files.map((file) => <MediaItem key={file.id} file={file} />)
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Files;

