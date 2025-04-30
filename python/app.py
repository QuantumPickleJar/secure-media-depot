"""
Main Flask Application

Configures and runs the Flask server with all routes and middleware.
"""
import os
from flask import Flask, request, render_template
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv
from controllers.auth_controller import auth_bp
from controllers.user_controller import user_bp
from controllers.admin_controller import admin_bp
from controllers.file_controller import file_bp
from auth.auth_middleware import authenticate_jwt, authorize_admin

# Load environment variables
load_dotenv()

def create_app(config=None):
    """
    Create and configure the Flask application.
    
    Args:
        config: Optional configuration dictionary
        
    Returns:
        Configured Flask application instance
    """
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Trust proxy headers if behind a reverse proxy
    app.wsgi_app = ProxyFix(app.wsgi_app)
    
    # Apply configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key_change_in_production'),
        UPLOAD_FOLDER=os.environ.get('UPLOAD_FOLDER', 'uploads'),
        MAX_CONTENT_LENGTH=100 * 1024 * 1024,  # 100MB max upload size
        DATABASE_URL=os.environ.get('DATABASE_URL', 'sqlite:///media.db'),
        JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY', 'jwt_secret_change_in_production')
    )
    
    if config:
        app.config.update(config)
        
    # Ensure the upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints with appropriate URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(file_bp, url_prefix='/api/files')
    
    # Apply authentication middleware to admin routes
    admin_bp.before_request(authenticate_jwt)
    admin_bp.before_request(authorize_admin)
    
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Apply authentication to user profile route
    @user_bp.before_request
    def protect_profile():
        if request.endpoint == 'user.profile':
            return authenticate_jwt(lambda: None)()
            
    # Apply authentication to file routes except search
    @file_bp.before_request
    def protect_file_routes():
        public_endpoints = {'file.search'}
        if request.endpoint not in public_endpoints:
            return authenticate_jwt(lambda: None)()
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'ok'}, 200
    
    # Frontend HTML routes
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/login')
    def login_page():
        return render_template('login.html')
    
    @app.route('/register')
    def register_page():
        return render_template('register.html')
    
    @app.route('/player')
    def player_page():
        return render_template('video_player.html')
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    # Start the development server if executed directly
    port = int(os.environ.get('PORT', 8081))
    app.run(host='0.0.0.0', port=port, debug=True)