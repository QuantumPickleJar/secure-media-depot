"""
Video Controller Module

Handles video-specific upload logic using VideoService and Video model.
"""
import os
from flask import Blueprint, request, jsonify, current_app, g
from werkzeug.utils import secure_filename
from services.video_service import VideoService
from models.file_model import File  # Import File model
from models.video_model import Video  # Import Video model
from flask_sqlalchemy import SQLAlchemy

class VideoController:
    """
    Controller for handling video-specific uploads using VideoService and Video model.
    """
    def __init__(self):
        # Use Flask's current_app to get config at request time
        pass

    def upload_video(self):
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        # Only allow video MIME types
        if not file.mimetype or not file.mimetype.startswith('video/'):
            return jsonify({'error': 'Only video files are allowed.'}), 400
        title = request.form.get('title', file.filename)
        try:
            upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
            max_storage = current_app.config.get('MAX_CONTENT_LENGTH', 100 * 1024 * 1024)
            video_service = VideoService(upload_folder, max_storage)
            video = video_service.upload_video(file, file.filename, title)
            return jsonify({
                'message': 'Video uploaded successfully',
                'videoId': video.id,
                'filename': video.key,
                'title': video.title
            }), 201
        except ValueError as ve:
            # Duplicate video error
            return jsonify({'error': str(ve)}), 409
        except Exception as err:
            print(f"Error uploading video: {err}")
            return jsonify({'error': 'An error occurred during video upload'}), 500

# Create a Flask blueprint for video routes
video_bp = Blueprint('video', __name__)
video_controller = VideoController()

@video_bp.route('/upload', methods=['POST'])
def upload_video():
    """Route for video upload using VideoService"""
    return video_controller.upload_video()

# Unified file and video listing endpoint
@video_bp.route('/list_all', methods=['GET'])
def list_all_files_and_videos():
    """Return a unified list of files and videos for the frontend browser."""
    db = current_app.extensions['sqlalchemy'].db
    files = db.session.query(File).all()
    videos = db.session.query(Video).all()
    # Normalize output
    file_items = [
        {
            'id': f.id,
            'filename': f.key,
            'originalName': getattr(f, 'original_name', f.key),
            'mimetype': getattr(f, 'mimetype', None),
            'size': getattr(f, 'size', None),
            'type': 'file'
        } for f in files
    ]
    video_items = [
        {
            'id': v.id,
            'filename': v.key,
            'originalName': v.title,
            'mimetype': v.mime_type,  # FIX: use correct field
            'size': v.size_bytes,     # FIX: use correct field
            'type': 'video'
        } for v in videos
    ]
    return jsonify({'items': file_items + video_items})

@video_bp.route('/list', methods=['GET'])
def list_videos():
    """Return a list of all videos (API completeness)."""
    db = current_app.extensions['sqlalchemy'].db
    videos = db.session.query(Video).all()
    video_items = [
        {
            'id': v.id,
            'filename': v.key,
            'originalName': v.title,
            'mimetype': getattr(v, 'mime_type', 'video/*'),
            'size': getattr(v, 'size_bytes', None),
            'type': 'video'
        } for v in videos
    ]
    return jsonify({'videos': video_items})

@video_bp.route('/stream/<int:video_id>', methods=['GET'])
def stream_video(video_id):
    """Stream a video file by its video ID."""
    db = current_app.extensions['sqlalchemy'].db
    video = db.session.query(Video).filter_by(id=video_id).first()
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    file_path = os.path.join(upload_folder, video.key)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found on disk'}), 404
    from flask import send_file
    # Always use the correct MIME type from the Video model
    return send_file(file_path, mimetype=video.mime_type, as_attachment=False)
