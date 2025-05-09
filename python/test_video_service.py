"""
Basic tests for VideoService and Video model.
"""
import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models.video_model import db, Video
from services.video_service import VideoService
import tempfile
import os

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
        self.service = VideoService(self.upload_dir, max_storage_bytes=10**7)

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

if __name__ == '__main__':
    unittest.main()
