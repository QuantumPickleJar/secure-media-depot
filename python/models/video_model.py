from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Video(db.Model): 
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key=True)
    # unique key to identify objects
    key = db.Column(db.string(255), unique=True, index=True, nullable=False)
    # title should be searchable
    title = db.Column(db.string(255), index = True, nullable=False)
    # byte-size on disk
    size_bytes = db.Column(db.Integer, nullable=False)
    # mime type (video/mp4, etc.)
    mime_type = db.Column(db.String(100), nullable=False)
    # date of upload
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)