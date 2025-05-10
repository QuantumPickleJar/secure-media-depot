"""
Authentication Middleware Module

Contains functions critical to user authentication and authorization
"""
from functools import wraps
from flask import request, jsonify, g
from services.jwt_service import JWTService
import jwt

class AuthMiddleware:
    """
    Middleware for handling authentication and authorization.
    Uses object-oriented approach for better organization.
    """
    
    def __init__(self, jwt_service=None):
        """
        Initialize with dependency injection for better testability.
        
        Args:
            jwt_service: JWT service instance for token verification
        """
        self.jwt_service = jwt_service or JWTService()
    
    def authenticate_jwt(self, f):
        """
        Decorator to verify JWT token from request headers.
        
        Args:
            f: Function to decorate
            
        Returns:
            Decorated function that only executes if token is valid
        """
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            
            if not auth_header:
                return jsonify({'error': 'No token provided'}), 401
                
            try:
                token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
                user = self.jwt_service.verify_token(token)
                
                # Store user info in request for controllers to access
                request.user = user
                
                # Also store in Flask's g object for access in the current request context
                g.user = user
                
                return f(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired'}), 401
            except (jwt.InvalidTokenError, IndexError):
                return jsonify({'error': 'Invalid token'}), 403
                
        return decorated_function
        
    def authorize_admin(self, f):
        """
        Decorator to check if authenticated user is an admin.
        Must be used after authenticate_jwt.
        
        Args:
            f: Function to decorate
            
        Returns:
            Decorated function that only executes if user is admin
        """
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(request, 'user'):
                return jsonify({'error': 'Authentication required'}), 401
                
            if not request.user.get('is_admin'):
                return jsonify({'error': 'Access denied: admin access only'}), 403
                
            return f(*args, **kwargs)
        return decorated_function

# Create a singleton instance for use in routes
auth_middleware = AuthMiddleware()

# Convenience exports for route decorators
authenticate_jwt = auth_middleware.authenticate_jwt
authorize_admin = auth_middleware.authorize_admin