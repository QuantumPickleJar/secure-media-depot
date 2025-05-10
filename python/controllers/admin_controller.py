"""
Admin Controller Module

Responsible for defining the server's response to requests/responses that
only admins can perform.

Operations include:
- (De)promoting users to/from admin status
- Managing user approvals
- User management operations
"""
from flask import Blueprint, request, jsonify
from models.user_model import UserModel

class AdminController:
    """
    Controller for handling admin-related operations.
    Uses a class-based approach for better organization and OOP principles.
    """
    
    def __init__(self, user_model=None):
        """
        Initialize with dependency injection for better testability.
        
        Args:
            user_model: The user model to use (defaults to UserModel if None)
        """
        self.user_model = user_model or UserModel()
    
    def approve_new_user(self, user_id):
        """
        Approves a user who has submitted a registration request.
        
        Args:
            user_id: ID of the user to approve
            
        Returns:
            JSON response indicating success or error
        """
        try:
            result = self.user_model.approve_user(user_id)
            if result:
                return jsonify({'message': f'User {user_id} approved successfully'}), 200
            return jsonify({'error': 'User not found'}), 404
        except Exception as err:
            print(f"Error approving user: {err}")
            return jsonify({'error': 'Internal server error'}), 500
    
    def deny_new_user(self, user_id):
        """
        Denies a user who has submitted a registration request.
        
        Args:
            user_id: ID of the user to deny
            
        Returns:
            JSON response indicating success or error
        """
        try:
            # For now just returning a basic response
            # In a real application, this might delete the user or set a denial flag
            return jsonify({'message': 'Request Denied'}), 200
        except Exception as err:
            print(f"Error denying user: {err}")
            return jsonify({'error': 'Internal server error'}), 500
    
    def get_all_users(self):
        """
        Gets all users from the database, both pending and registered.
        
        Returns:
            JSON response with list of users or error
        """
        try:
            users = self.user_model.get_all_users()
            return jsonify({'users': [user.to_dict() for user in users]}), 200
        except Exception as err:
            print(f"Error fetching users: {err}")
            return jsonify({'error': 'Internal server error'}), 500
    
    def get_pending_users(self):
        """
        Retrieves registration requests awaiting review.
        
        Returns:
            JSON response with list of pending users or error
        """
        try:
            users = self.user_model.get_users_by_approval_status(0)
            return jsonify({'pendingUsers': [user.to_dict() for user in users]}), 200
        except Exception as err:
            print(f"Error fetching pending users: {err}")
            return jsonify({'error': 'Internal server error'}), 500
    
    def get_registered_users(self):
        """
        Retrieves users who have been approved.
        
        Returns:
            JSON response with list of registered users or error
        """
        try:
            users = self.user_model.get_users_by_approval_status(1)
            return jsonify({'registeredUsers': [user.to_dict() for user in users]}), 200
        except Exception as err:
            print(f"Error fetching registered users: {err}")
            return jsonify({'error': 'Internal server error'}), 500
    
    def get_user_by_id(self, user_id):
        """
        Fetches a user by their userId.
        
        Args:
            user_id: ID of the user to retrieve
            
        Returns:
            JSON response with user details or error
        """
        try:
            user = self.user_model.get_user_by_id(user_id)
            if user:
                return jsonify({'user': user.to_dict()}), 200
            return jsonify({'error': 'User not found'}), 404
        except Exception as err:
            print(f"Error fetching user: {err}")
            return jsonify({'error': 'Internal server error'}), 500

# Create a Flask blueprint for admin routes
admin_bp = Blueprint('admin', __name__)

# Create controller instance
admin_controller = AdminController()

# Define routes
@admin_bp.route('/approve/<int:user_id>', methods=['PATCH'])
def approve_user(user_id):
    """Route to approve a user"""
    return admin_controller.approve_new_user(user_id)

@admin_bp.route('/deny/<int:user_id>', methods=['PATCH'])
def deny_user(user_id):
    """Route to deny a user"""
    return admin_controller.deny_new_user(user_id)

@admin_bp.route('/users', methods=['GET'])
def get_all_users():
    """Route to get all users"""
    return admin_controller.get_all_users()

@admin_bp.route('/users/pending', methods=['GET'])
def get_pending_users():
    """Route to get pending users"""
    return admin_controller.get_pending_users()

@admin_bp.route('/users/registered', methods=['GET'])
def get_registered_users():
    """Route to get registered users"""
    return admin_controller.get_registered_users()

@admin_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Route to get a specific user"""
    return admin_controller.get_user_by_id(user_id)