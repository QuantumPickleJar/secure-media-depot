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
    """Return a unified paginated list of files and videos for the frontend browser."""
    db = current_app.extensions['sqlalchemy'].db
    # Get pagination params
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
    except ValueError:
        page = 1
        per_page = 20

    # Paginate files and videos separately, then merge
    files_query = db.session.query(File)
    videos_query = db.session.query(Video)
    files_pagination = files_query.order_by(File.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
    videos_pagination = videos_query.order_by(Video.id.desc()).paginate(page=page, per_page=per_page, error_out=False)

    file_items = [
        {
            'id': f.id,
            'filename': f.key,
            'originalName': getattr(f, 'original_name', f.key),
            'mimetype': getattr(f, 'mimetype', None),
            'size': getattr(f, 'size', None),
            'type': 'file'
        } for f in files_pagination.items
    ]
    video_items = [
        {
            'id': v.id,
            'filename': v.key,
            'originalName': v.title,
            'mimetype': v.mime_type,
            'size': v.size_bytes,
            'type': 'video'
        } for v in videos_pagination.items
    ]
    # Merge and sort by id desc (most recent first)
    merged_items = sorted(file_items + video_items, key=lambda x: x['id'], reverse=True)
    return jsonify({
        'items': merged_items,
        'page': page,
        'per_page': per_page,
        'total_files': files_pagination.total,
        'total_videos': videos_pagination.total,
        'total_items': files_pagination.total + videos_pagination.total
    })

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
        print(f"DEBUG: Video ID {video_id} not found in database")
        return jsonify({'error': 'Video not found'}), 404
    
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not os.path.isabs(upload_folder):
        # Convert relative path to absolute if needed
        upload_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), upload_folder)
    file_path = os.path.join(upload_folder, video.key)
    
    print(f"DEBUG: Stream request for video ID {video_id}")
    print(f"DEBUG: Video record: key={video.key}, mime_type={video.mime_type}, size={video.size_bytes}")
    print(f"DEBUG: Looking for file at: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"DEBUG: File not found at path: {file_path}")
        return jsonify({'error': 'File not found on disk'}), 404
    
    # Check if the file is actually a valid video file
    file_size = os.path.getsize(file_path)
    print(f"DEBUG: Found file at {file_path}, size: {file_size} bytes")
    
    from flask import send_file
    # Always use the correct MIME type from the Video model
    print(f"DEBUG: Streaming file with MIME type: {video.mime_type}")
    return send_file(file_path, mimetype=video.mime_type, as_attachment=False)
