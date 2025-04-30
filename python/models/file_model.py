"""
File Model Module

Provides database interaction for file-related operations
using SQLAlchemy ORM for better object-oriented design.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, create_engine, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session, relationship
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create SQLAlchemy base class
Base = declarative_base()

class File(Base):
    """SQLAlchemy File model for database mapping."""
    
    __tablename__ = 'files'
    
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(512), nullable=False)
    mimetype = Column(String(100))
    size = Column(Integer)
    uploaded_by = Column(String(50), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert file object to dictionary for API responses."""
        return {
            'id': self.id,
            'filename': self.filename,
            'mimetype': self.mimetype,
            'size': self.size,
            'uploaded_by': self.uploaded_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }

class FileModel:
    """
    File model service class that handles database operations.
    Uses OOP principles to encapsulate database logic.
    """
    
    def __init__(self, db_url=None):
        """
        Initialize the database connection.
        
        Args:
            db_url: Database connection string (defaults to SQLite from env)
        """
        self.db_url = db_url or os.environ.get('DATABASE_URL', 'sqlite:///media.db')
        self.engine = create_engine(self.db_url)
        
        # Create session factory
        session_factory = sessionmaker(bind=self.engine)
        self.Session = scoped_session(session_factory)
        
        # Create tables if they don't exist
        Base.metadata.create_all(self.engine)
        
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
        session = self.Session()
        try:
            file = File(
                filename=filename,
                filepath=filepath,
                mimetype=mimetype,
                size=size,
                uploaded_by=uploaded_by
            )
            session.add(file)
            session.commit()
            session.refresh(file)
            return file
        finally:
            session.close()
            
    def get_file_by_id(self, file_id):
        """
        Get a file by ID.
        
        Args:
            file_id: File ID to search for
            
        Returns:
            File object if found, None otherwise
        """
        session = self.Session()
        try:
            return session.query(File).filter(File.id == file_id).first()
        finally:
            session.close()
            
    def get_all_files(self):
        """
        Get all files.
        
        Returns:
            List of all file objects
        """
        session = self.Session()
        try:
            return session.query(File).all()
        finally:
            session.close()
            
    def get_files_by_user(self, username):
        """
        Get files uploaded by a specific user.
        
        Args:
            username: Username of the uploader
            
        Returns:
            List of file objects uploaded by the specified user
        """
        session = self.Session()
        try:
            return session.query(File).filter(File.uploaded_by == username).all()
        finally:
            session.close()
            
    def search_files(self, query):
        """
        Search for files by filename.
        
        Args:
            query: Search query string
            
        Returns:
            List of file objects matching the search criteria
        """
        if not query:
            return []
            
        search_term = f"%{query}%"
        session = self.Session()
        try:
            return session.query(File).filter(
                or_(
                    File.filename.ilike(search_term),
                    File.mimetype.ilike(search_term)
                )
            ).all()
        finally:
            session.close()
            
    def delete_file(self, file_id):
        """
        Delete a file record by ID.
        
        Args:
            file_id: ID of the file to delete
            
        Returns:
            True if file was found and deleted, False otherwise
        """
        session = self.Session()
        try:
            file = session.query(File).filter(File.id == file_id).first()
            if file:
                session.delete(file)
                session.commit()
                return True
            return False
        finally:
            session.close()