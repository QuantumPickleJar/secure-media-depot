import os, shutil
from flask import current_app
from werkzeug.datastructures import FileStorage
from models.video_model import db, Video

class VideoService:
    def __init__(self, upload_folder: str, max_storage_bytes: int):
        self.upload_folder = upload_folder
        self.max_storage = max_storage_bytes
        os.makedirs(self.upload_folder, exist_ok=True)

    # upload_video parameters:
    # - file_stream: FileStorage object (Flask) for the uploaded file
    # - filename: str, the object key (used both on disk and in DB)
    # - title: str, human-readable title stored in metadata
    def upload_video(self, file_stream: FileStorage, filename: str, title: str):
        # 1. Check disk space
        free = shutil.disk_usage(self.upload_folder).free
        file_stream.seek(0, os.SEEK_END)
        size = file_stream.tell()
        file_stream.seek(0)
        if size > free or size + self._total_used() > self.max_storage:
            raise IOError("Not enough storage available")

        # 2. Save blob
        dest = os.path.join(self.upload_folder, filename)
        file_stream.save(dest)

        # 3. Create metadata record
        video = Video(
            key=filename,
            title=title,
            size_bytes=size,
            mime_type=file_stream.mimetype
        )
        db.session.add(video)
        db.session.commit()
        return video

    # search_videos parameters:
    # - search_term: str, substring to match against Video.title
    # - page: int, page number for pagination
    # - per_page: int, number of items per page
    def search_videos(self, search_term: str, page: int = 1, per_page: int = 20):
        '''TODO: add properly formatted python comments here'''
        q = Video.query.filter(Video.title.ilike(f"%{search_term}%"))
        return q.order_by(Video.uploaded_at.desc())\
                .paginate(page=page, per_page=per_page)

    # get_video parameters:
    # - key: str, the object key from the URL path
    def get_video(self, key: str):
        return Video.query.filter_by(key=key).first()

    def _total_used(self):
        # internal: sum of all stored file sizes
        return db.session.query(db.func.sum(Video.size_bytes)).scalar() or 0
    
    def search_videos_by_title(search_term, page=1, per_page=20):
        query = Video.query.filter(Video.title.ilike(f"%{search_term}%"))
        return query.order_by(Video.uploaded_at.desc()) \
                .paginate(page=page, per_page=per_page)
