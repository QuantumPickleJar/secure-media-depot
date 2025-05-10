"""
File Model Module

Provides database interaction for file-related operations
using Flask-SQLAlchemy for better object-oriented design.
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from models.video_model import db  # Use the same db instance

class File(db.Model):
    """Flask-SQLAlchemy File model for database mapping."""
    
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(255), unique=True, index=True, nullable=False)  # Use 'key' for consistency
    original_name = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(512), nullable=False)
    mimetype = db.Column(db.String(100))
    size = db.Column(db.Integer)
    uploaded_by = db.Column(db.String(50), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert file object to dictionary for API responses."""
        return {
            'id': self.id,
            'filename': self.key,
            'originalName': self.original_name,
            'mimetype': self.mimetype,
            'size': self.size,
            'uploaded_by': self.uploaded_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }

class FileModel:
    """
    File model service class that handles database operations using Flask-SQLAlchemy.
    """
    def create_file_record(self, filename, filepath, mimetype, size, uploaded_by):
        """
        Create a new file record.
        
        Args:
            filename: Name of the file
            filepath: Path where the file is stored
            mimetype: MIME type of the file
            size: Size of the file in bytes
            uploaded_by: Username of the uploader
            
        Returns:
            Created file object
        """
        file = File(
            key=filename,
            original_name=filename,
            filepath=filepath,
            mimetype=mimetype,
            size=size,
            uploaded_by=uploaded_by
        )
        db.session.add(file)
        db.session.commit()
        return file

    def get_file_by_id(self, file_id):
        """
        Get a file by ID.
        
        Args:
            file_id: File ID to search for
            
        Returns:
            File object if found, None otherwise
        """
        return File.query.filter_by(id=file_id).first()

    def get_all_files(self):
        """
        Get all files.
        
        Returns:
            List of all file objects
        """
        return File.query.all()

    def get_files_by_user(self, username):
        """
        Get files uploaded by a specific user.
        
        Args:
            username: Username of the uploader
            
        Returns:
            List of file objects uploaded by the specified user
        """
        return File.query.filter_by(uploaded_by=username).all()