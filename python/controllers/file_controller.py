"""
File Controller Module

Responsible for defining the server's response to requests related to file operations.
Implements robust video streaming with byte range support and appropriate handling of
different file types (streaming vs. download).
"""
import os
import mimetypes
from flask import Blueprint, request, jsonify, send_file, Response, current_app, g
from werkzeug.utils import secure_filename
from models.file_model import FileModel

class FileController:
    """
    Controller for handling file-related operations including streaming and downloads.
    Uses a class-based approach for better organization and OOP principles.
    """
    
    def __init__(self, file_model=None):
        """
        Initialize with dependency injection for better testability.
        
        Args:
            file_model: The file model to use (defaults to FileModel if None)
        """
        self.file_model = file_model or FileModel()
        
    def upload_file(self):
        """
        Handles file upload.
        
        Returns:
            JSON response indicating success or error
        """
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        # Get username from auth middleware via g
        username = g.user.get('username')
        
        try:
            # Secure the filename to prevent any malicious file paths
            filename = secure_filename(file.filename)
            
            # Determine file path
            upload_folder = current_app.config['UPLOAD_FOLDER']
            filepath = os.path.join(upload_folder, filename)
            
            # Save the file
            file.save(filepath)
            
            # Store file information in database
            file_info = self.file_model.create_file_record(
                filename=filename,
                filepath=filepath,
                mimetype=file.mimetype,
                size=os.path.getsize(filepath),
                uploaded_by=username
            )
            
            return jsonify({
                'message': 'File uploaded successfully',
                'fileId': file_info.id,
                'filename': file_info.filename
            }), 201
            
        except Exception as err:
            print(f"Error uploading file: {err}")
            return jsonify({'error': 'An error occurred during file upload'}), 500
    
    def get_file_list(self):
        """
        Gets a list of all files available to the user.
        
        Returns:
            JSON response with file list or error
        """
        try:
            # No longer require authenticated user for file listing 
            # username = g.user.get('username')  # removed to avoid missing user error
            
            # Get files (could filter by user permissions in a more complex implementation)
            files = self.file_model.get_all_files()
            
            return jsonify({
                'files': [file.to_dict() for file in files]
            }), 200
            
        except Exception as err:
            print(f"Error getting file list: {err}")
            return jsonify({'error': 'An error occurred while retrieving files'}), 500
    
    def get_file(self, file_id):
        """
        Gets a specific file by its ID.
        
        Args:
            file_id: ID of the file to retrieve
            
        Returns:
            File content with appropriate headers or error response
        """
        try:
            file_info = self.file_model.get_file_by_id(file_id)
            
            if not file_info:
                return jsonify({'error': 'File not found'}), 404
                
            filepath = file_info.filepath
            
            if not os.path.exists(filepath):
                return jsonify({'error': 'File not found on server'}), 404
                
            # Check if this is a streamable file type
            mimetype = file_info.mimetype or mimetypes.guess_type(filepath)[0]
            is_streamable = mimetype and (
                mimetype.startswith('video/') or 
                mimetype.startswith('audio/')
            )
            
            # Handle streaming for video/audio content
            if is_streamable:
                return self._stream_file(filepath, mimetype)
                
            # For other file types, return as attachment for download
            return send_file(
                filepath,
                mimetype=mimetype,
                as_attachment=True,
                attachment_filename=file_info.filename
            )
                
        except Exception as err:
            print(f"Error retrieving file: {err}")
            return jsonify({'error': 'An error occurred while retrieving the file'}), 500
    
    def _stream_file(self, filepath, mimetype):
        """
        Streams a file with byte range support.
        
        Args:
            filepath: Path to the file to stream
            mimetype: MIME type of the file
            
        Returns:
            Response object with appropriate headers for streaming
        """
        file_size = os.path.getsize(filepath)
        
        # Handle range requests for video/audio streaming
        range_header = request.headers.get('Range', None)
        
        if range_header:
            # Parse the range header
            byte_start, byte_end = 0, None
            if range_header.startswith('bytes='):
                range_str = range_header[6:].split('-')
                if range_str[0]:
                    byte_start = int(range_str[0])
                if len(range_str) > 1 and range_str[1]:
                    byte_end = int(range_str[1])
            
            if byte_end is None:
                byte_end = file_size - 1
                
            # Make sure we don't exceed the file size
            byte_end = min(byte_end, file_size - 1)
            
            # Calculate the content length
            content_length = byte_end - byte_start + 1
            
            # Create response headers
            headers = {
                'Content-Range': f'bytes {byte_start}-{byte_end}/{file_size}',
                'Accept-Ranges': 'bytes',
                'Content-Length': str(content_length),
                'Content-Type': mimetype
            }
            
            # Open the file at the specified position
            def generate():
                with open(filepath, 'rb') as f:
                    f.seek(byte_start)
                    data = f.read(content_length)
                    yield data
            
            return Response(generate(), 206, headers)
        else:
            # If no range header, return the entire file
            def generate():
                with open(filepath, 'rb') as f:
                    while True:
                        chunk = f.read(8192)  # Read in 8KB chunks
                        if not chunk:
                            break
                        yield chunk
            
            headers = {
                'Accept-Ranges': 'bytes',
                'Content-Length': str(file_size),
                'Content-Type': mimetype
            }
            
            return Response(generate(), 200, headers)
    
    def delete_file(self, file_id):
        """
        Deletes a file by its ID.
        
        Args:
            file_id: ID of the file to delete
            
        Returns:
            JSON response indicating success or error
        """
        try:
            # Get user info from auth middleware via g
            username = g.user.get('username')
            is_admin = g.user.get('is_admin', False)
            
            file_info = self.file_model.get_file_by_id(file_id)
            
            if not file_info:
                return jsonify({'error': 'File not found'}), 404
                
            # Check if the user has permission (owner or admin)
            if not is_admin and file_info.uploaded_by != username:
                return jsonify({'error': 'Permission denied'}), 403
                
            # Delete the file from storage
            if os.path.exists(file_info.filepath):
                os.remove(file_info.filepath)
                
            # Delete the file record from the database
            self.file_model.delete_file(file_id)
            
            return jsonify({'message': 'File deleted successfully'}), 200
            
        except Exception as err:
            print(f"Error deleting file: {err}")
            return jsonify({'error': 'An error occurred while deleting the file'}), 500

    def search_files(self):
        """
        Searches for files based on query parameters.
        
        Returns:
            JSON response with search results or error
        """
        try:
            query = request.args.get('query', '')
            
            files = self.file_model.search_files(query)
            
            return jsonify({
                'results': [file.to_dict() for file in files]
            }), 200
            
        except Exception as err:
            print(f"Error searching files: {err}")
            return jsonify({'error': 'An error occurred during file search'}), 500
        

# Create a Flask blueprint for file routes
file_bp = Blueprint('file', __name__)

# Create controller instance
file_controller = FileController()

# Define routes
@file_bp.route('/upload', methods=['POST'])
def upload():
    """Route for file upload"""
    return file_controller.upload_file()

@file_bp.route('/list', methods=['GET'])
def get_files():
    """Route to get all files"""
    return file_controller.get_file_list()

@file_bp.route('/<int:file_id>', methods=['GET'])
def get_file(file_id):
    """Route to get a specific file"""
    return file_controller.get_file(file_id)

@file_bp.route('/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    """Route to delete a file"""
    return file_controller.delete_file(file_id)

@file_bp.route('/search', methods=['GET'])
def search():
    """Route to search files"""
    return file_controller.search_files()