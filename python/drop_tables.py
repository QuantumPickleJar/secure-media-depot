# drop_tables.py
"""
Script to drop all tables in the Flask SQLAlchemy database.
Usage: python drop_tables.py
"""
from flask import Flask
from models.video_model import db
from models.file_model import File
from models.video_model import Video

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///media.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("All tables dropped.")
