"""
User Model Module

Provides database interaction for user-related operations
using SQLAlchemy ORM for better object-oriented design.
"""
from sqlalchemy import Column, Integer, String, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create SQLAlchemy base class
Base = declarative_base()

class User(Base):
    """SQLAlchemy User model for database mapping."""
    
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_admin = Column(Integer, default=0)
    is_approved = Column(Integer, default=0)
    
    def to_dict(self):
        """Convert user object to dictionary for API responses."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': bool(self.is_admin),
            'is_approved': bool(self.is_approved)
        }

class UserModel:
    """
    User model service class that handles database operations.
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
        
    def create(self, username, email, password, is_admin=0, is_approved=0):
        """
        Create a new user.
        
        Args:
            username: User's username
            email: User's email
            password: User's hashed password
            is_admin: Whether the user is an admin (default: 0)
            is_approved: Whether the user is approved (default: 0)
            
        Returns:
            Created user object
        """
        session = self.Session()
        try:
            user = User(
                username=username,
                email=email,
                password=password,
                is_admin=is_admin,
                is_approved=is_approved
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
        finally:
            session.close()
            
    def get_by_username(self, username):
        """
        Get a user by username.
        
        Args:
            username: Username to search for
            
        Returns:
            User object if found, None otherwise
        """
        session = self.Session()
        try:
            return session.query(User).filter(User.username == username).first()
        finally:
            session.close()
            
    def get_user_by_id(self, user_id):
        """
        Get a user by ID.
        
        Args:
            user_id: User ID to search for
            
        Returns:
            User object if found, None otherwise
        """
        session = self.Session()
        try:
            return session.query(User).filter(User.id == user_id).first()
        finally:
            session.close()
            
    def get_all_users(self):
        """
        Get all users.
        
        Returns:
            List of all user objects
        """
        session = self.Session()
        try:
            return session.query(User).all()
        finally:
            session.close()
            
    def get_users_by_approval_status(self, is_approved):
        """
        Get users filtered by approval status.
        
        Args:
            is_approved: Approval status to filter by (0=pending, 1=approved)
            
        Returns:
            List of user objects with the specified approval status
        """
        session = self.Session()
        try:
            return session.query(User).filter(User.is_approved == is_approved).all()
        finally:
            session.close()
            
    def approve_user(self, user_id):
        """
        Approve a user by ID.
        
        Args:
            user_id: ID of the user to approve
            
        Returns:
            True if user was found and approved, False otherwise
        """
        session = self.Session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                user.is_approved = 1
                session.commit()
                return True
            return False
        finally:
            session.close()
            
    def count_users(self):
        """
        Count all users in the database.
        
        Returns:
            Number of users
        """
        session = self.Session()
        try:
            return session.query(User).count()
        finally:
            session.close()
            
    def delete_user(self, user_id):
        """
        Delete a user by ID.
        
        Args:
            user_id: ID of the user to delete
            
        Returns:
            True if user was found and deleted, False otherwise
        """
        session = self.Session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                session.delete(user)
                session.commit()
                return True
            return False
        finally:
            session.close()