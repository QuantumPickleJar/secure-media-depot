import React from 'react';

function MediaItem({ file }) {
  const renderMedia = () => {
    switch (file.type) {
      case 'image':
        return <img src={`/uploads/thumbnails/${file.filename}`} alt={file.name} width="200" />;
      case 'video':
        return (
          <video width="320" height="240" controls>
            <source src={`/uploads/videos/${file.filename}`} type={file.mimetype} />
            Your browser does not support the video tag.
          </video>
        );
      case 'document':
        return <a href={`/uploads/documents/${file.filename}`} download>{file.name}</a>;
      default:
        return <p>Unsupported file type.</p>;
    }
  };

  return (
    <div className="media-item" style={{ margin: '10px', border: '1px solid #ccc', padding: '10px' }}>
      <h4>{file.name}</h4>
      {renderMedia()}
      <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
    </div>
  );
}

export default MediaItem;
