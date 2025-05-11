# secure-media-depot/python/app.py

"""
Main Flask Application

Configures and runs the Flask server with all routes and middleware.
"""
import os
from flask import Flask, request, render_template, Blueprint, redirect, url_for
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

from controllers.auth_controller import auth_bp
from controllers.user_controller import user_bp
from controllers.admin_controller import admin_bp
from controllers.file_controller import file_bp
from controllers.video_controller import video_bp
from auth.auth_middleware import authenticate_jwt, authorize_admin
from models.video_model import db

# Load environment variables
load_dotenv()

def create_app(config=None):
    """
    Create and configure the Flask application.
    """
    # Instantiate Flask with static assets served at /static
    app = Flask(
        __name__,
        static_folder='static',
        static_url_path='/media/static'
    )

    # Enable CORS
    CORS(app)
    app.wsgi_app = ProxyFix(app.wsgi_app)

    # Base configuration
    default_uploads_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'uploads'
    )
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key_change_in_production'),
        UPLOAD_FOLDER=os.environ.get('UPLOAD_FOLDER', default_uploads_path),
        MAX_CONTENT_LENGTH=100 * 1024 * 1024,
        SQLALCHEMY_DATABASE_URI=os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///media.db'),
        JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY', 'jwt_secret_change_in_production')
    )
    if config:
        app.config.update(config)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register API blueprints (unchanged)
    app.register_blueprint(auth_bp,  url_prefix='/api/auth')
    app.register_blueprint(user_bp,  url_prefix='/api/users')
    app.register_blueprint(file_bp,  url_prefix='/api/files')
    app.register_blueprint(video_bp, url_prefix='/api/videos')
    admin_bp.before_request(authenticate_jwt)
    admin_bp.before_request(authorize_admin)
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Group all UI routes into a blueprint mounted at /media
    ui_bp = Blueprint(
        'ui',
        __name__,
        template_folder='templates'
    )

    @ui_bp.route('/')
    def home_page():
        return redirect(url_for('ui.files_page'))

    @ui_bp.route('/login')
    def login_page():
        return render_template('login.html')

    @ui_bp.route('/register')
    def register_page():
        return render_template('register.html')

    @ui_bp.route('/player')
    def player_page():
        return render_template('video_player.html')

    @ui_bp.route('/files')
    def files_page():
        return render_template('files.html')

    app.register_blueprint(ui_bp, url_prefix='/media')

    # JWT protections (unchanged)
    @user_bp.before_request
    def protect_profile():
        if request.endpoint == 'user.profile':
            return authenticate_jwt(lambda: None)()
    @file_bp.before_request
    def protect_file_routes():
        public_endpoints = {'file.search'}
        if request.endpoint not in public_endpoints:
            return authenticate_jwt(lambda: None)()

    # Health check (unchanged)
    @app.route('/health')
    def health_check():
        return {'status': 'ok'}, 200

    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    # Debug mode shows auto-reload but switch off in production
    app.run(host='0.0.0.0', port=port, debug=True)
