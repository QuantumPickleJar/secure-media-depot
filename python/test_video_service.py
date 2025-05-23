'''
Basic tests for VideoService and Video model.
'''
import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models.video_model import db, Video
from services.video_service import VideoService
import tempfile
import os
from werkzeug.datastructures import FileStorage

class VideoServiceTestCase(unittest.TestCase):
    def setUp(self):
        # Create a temp directory for uploads
        self.upload_dir = tempfile.mkdtemp()
        # Minimal Flask app and in-memory DB
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)
        with self.app.app_context():
            db.create_all()
        
        # 3GB limit
        self.service = VideoService(self.upload_dir, max_storage_bytes=30**9)

    def tearDown(self):
        # Remove temp upload dir
        for f in os.listdir(self.upload_dir):
            os.remove(os.path.join(self.upload_dir, f))
        os.rmdir(self.upload_dir)

    def test_add_dummy_video(self):
        # Add a dummy video row directly
        with self.app.app_context():
            dummy = Video(key='dummy.mp4', title='Dummy Video', size_bytes=1234, mime_type='video/mp4')
            db.session.add(dummy)
            db.session.commit()
            # Query back
            found = Video.query.filter_by(key='dummy.mp4').first()
            self.assertIsNotNone(found)
            self.assertEqual(found.title, 'Dummy Video')
            self.assertEqual(found.size_bytes, 1234)
            self.assertEqual(found.mime_type, 'video/mp4')

    def test_upload_video(self):
        # Test uploading a video file
        with self.app.app_context():
            # Create a dummy video file
            video_path = os.path.join(self.upload_dir, 'test_video.mp4')
            with open(video_path, 'wb') as f:
                f.write(b'\x00' * 1024)  # 1KB dummy file
            
            # Simulate a FileStorage object
            with open(video_path, 'rb') as f:
                f.seek(0) # set stream to the start position
                file_stream = FileStorage(stream=f, filename='test_video.mp4', content_type='video/mp4')
                                
                try:
                    # Call the upload_video method
                    video = self.service.upload_video(file_stream, 'test_video.mp4', 'Test Video')
                except Exception as e:
                    print("Upload error:", e)
                    raise
                
                # Assertions
                self.assertIsNotNone(video)
                self.assertEqual(video.key, 'test_video.mp4')
                self.assertEqual(video.title, 'Test Video')
                self.assertEqual(video.size_bytes, 1024)
                self.assertEqual(video.mime_type, 'video/mp4')
                
                # Check if the file exists in the upload directory
                self.assertTrue(os.path.exists(os.path.join(self.upload_dir, 'test_video.mp4')))