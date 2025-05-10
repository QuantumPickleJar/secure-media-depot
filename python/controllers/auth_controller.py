"""
Authentication Controller Module

Responsible for defining the server's response to requests and responses
related to authentication (logging in/out)
"""
import bcrypt
from flask import Blueprint, request, jsonify
from services.jwt_service import JWTService
from models.user_model import UserModel

class AuthController:
    """
    Controller for handling authentication-related operations.
    Uses a class-based approach for better organization and OOP principles.
    """
    
    def __init__(self, user_model=None, jwt_service=None):
        """
        Initialize with dependency injection for better testability.
        
        Args:
            user_model: The user model to use (defaults to UserModel if None)
            jwt_service: The JWT service to use (defaults to JWTService if None)
        """
        self.user_model = user_model or UserModel()
        self.jwt_service = jwt_service or JWTService()
    
    def login_user(self):
        """
        Authenticates a user and generates a JWT token.
        
        Returns:
            JSON response with token or error message
        """
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        try:
            user = self.user_model.get_by_username(username)
            
            if not user:
                return jsonify({'error': 'Invalid username or password'}), 400
                
            if user.is_approved == 0:
                return jsonify({'error': 'Your account is awaiting approval.'}), 403
                
            # Verify the entered password
            # We need to encode both the input password and stored hash for bcrypt
            valid_password = bcrypt.checkpw(
                password.encode('utf-8'), 
                user.password.encode('utf-8')
            )
            
            if not valid_password:
                return jsonify({'error': 'Invalid username or password'}), 400
                
            token = self.jwt_service.generate_token({
                'username': user.username,
                'is_admin': user.is_admin
            })
            
            return jsonify({'token': token})
            
        except Exception as err:
            print(f"Error logging in: {err}")
            return jsonify({'error': 'Server error'}), 500
            
    def logout_user(self):
        """
        Handles user logout.
        
        Note: For JWT, logout is typically handled client-side by removing the token.
        This method provides a server-side endpoint for consistency.
        
        Returns:
            Success message
        """
        return jsonify({'message': 'Logout successful'})

# Create a Flask blueprint for auth routes
auth_bp = Blueprint('auth', __name__)

# Create controller instance
auth_controller = AuthController()

# Define routes
@auth_bp.route('/login', methods=['POST'])
def login():
    """Route for user login"""
    return auth_controller.login_user()

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Route for user logout"""
    return auth_controller.logout_user()