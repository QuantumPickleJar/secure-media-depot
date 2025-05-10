"""
User Controller Module

Handles server behavior for requests and responses involved with
user registration and profile management.
"""
import os
from flask import Blueprint, request, jsonify
import bcrypt
from dotenv import load_dotenv
from models.user_model import UserModel

# Load environment variables
load_dotenv()

class UserController:
    """
    Controller for handling user-related operations.
    Uses a class-based approach for better organization and OOP principles.
    """
    
    def __init__(self, user_model=None):
        """
        Initialize with dependency injection for better testability.
        
        Args:
            user_model: The user model to use (defaults to UserModel if None)
        """
        self.user_model = user_model or UserModel()
        
    def register_user(self):
        """
        Register a new user.
        
        Returns:
            JSON response with user information or error
        """
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        admin_code = data.get('adminCode')
        
        try:
            # Count users to determine if this is the first user
            num_users = self.user_model.count_users()
            is_admin = 0
            is_approved = 0
            
            # Check if the user should be an admin
            if admin_code and admin_code == os.environ.get('ADMIN_CODE'):
                is_admin = 1
                is_approved = 1
            elif num_users == 0:
                # First user is automatically an admin
                is_admin = 1
                is_approved = 1
            else:
                # Standard users require approval
                is_approved = 0
                
            # Hash the password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create the user
            user = self.user_model.create(username, email, hashed_password, is_admin, is_approved)
            
            return jsonify({
                'message': 'User successfully registered!',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_admin': user.is_admin,
                    'is_approved': user.is_approved
                }
            }), 201
            
        except Exception as err:
            # Handle database constraint violations
            if hasattr(err, 'orig') and getattr(err.orig, 'sqlite_errorcode', None) == 19:  # SQLITE_CONSTRAINT
                return jsonify({'error': 'Username/email already in use'}), 400
            else:
                # Log the error for debugging
                print(f"Registration error: {err}")
                return jsonify({'error': 'Internal server error'}), 500
                
    def get_user_profile(self):
        """
        Get user profile information using the username from the authenticated user.
        
        Returns:
            JSON response with user information or error
        """
        # In Flask, the user would be available from the auth middleware
        username = request.user.get('username')
        
        try:
            user = self.user_model.get_by_username(username)
            if user:
                return jsonify({
                    'username': user.username,
                    'email': user.email,
                    'is_admin': user.is_admin
                })
            else:
                return jsonify({'error': 'User not found'}), 404
        except Exception as err:
            print(f"Error fetching user profile: {err}")
            return jsonify({'error': 'Internal server error!'}), 500

# Create a Flask blueprint for user routes
user_bp = Blueprint('user', __name__)

# Create controller instance
user_controller = UserController()

# Define routes
@user_bp.route('/register', methods=['POST'])
def register():
    """Route for user registration"""
    return user_controller.register_user()

@user_bp.route('/profile', methods=['GET'])
def profile():
    """Route for getting user profile, requires authentication"""
    # The auth middleware will need to be applied to this route
    return user_controller.get_user_profile()