"""
JWT Service Module

Responsible for generating and verifying JWT tokens
"""
import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class JWTService:
    """
    Service for JWT token generation and verification.
    Uses object-oriented approach for better maintainability.
    """
    
    def __init__(self, secret_key=None, expiration_hours=1):
        """
        Initialize JWT service with secret key and token expiration time.
        
        Args:
            secret_key: Secret key for JWT token signature (default: from env variable)
            expiration_hours: Token expiration time in hours (default: 1)
        """
        self.secret_key = secret_key or os.environ.get('JWT_SECRET_KEY', 'default_secret_key_change_in_production')
        self.expiration_hours = expiration_hours
        
    def generate_token(self, payload):
        """
        Generate a JWT token with the provided payload.
        
        Args:
            payload: Dictionary containing data to include in the token
            
        Returns:
            Generated JWT token string
        """
        # Create a copy of the payload to avoid modifying the original
        token_payload = payload.copy()
        
        # Add expiration time
        token_payload['exp'] = datetime.utcnow() + timedelta(hours=self.expiration_hours)
        
        # Generate token
        token = jwt.encode(token_payload, self.secret_key, algorithm='HS256')
        
        # PyJWT >= 2.0.0 returns the token as a string
        # PyJWT < 2.0.0 returns the token as bytes
        if isinstance(token, bytes):
            return token.decode('utf-8')
        return token
        
    def verify_token(self, token):
        """
        Verify the JWT token and return its payload.
        
        Args:
            token: JWT token to verify
            
        Returns:
            Token payload as dictionary
            
        Raises:
            jwt.ExpiredSignatureError: If token has expired
            jwt.InvalidTokenError: If token is invalid
        """
        return jwt.decode(token, self.secret_key, algorithms=['HS256'])