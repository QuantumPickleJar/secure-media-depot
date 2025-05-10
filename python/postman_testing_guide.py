"""
Secure Media Depot - Postman Testing Guide

This script provides instructions and example requests for testing 
the Flask application with Postman. Run this script to see testing instructions.
"""
import json
import os

def print_header(text):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f" {text} ".center(80, '='))
    print("="*80 + "\n")

def print_postman_collection():
    """Generate and print a Postman collection for testing"""
    collection = {
        "info": {
            "name": "Secure Media Depot API",
            "description": "Collection for testing the Secure Media Depot Python API",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
            # User Registration
            {
                "name": "1. Register User",
                "request": {
                    "method": "POST",
                    "header": [
                        {
                            "key": "Content-Type",
                            "value": "application/json"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/users/register",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "users", "register"]
                    },
                    "body": {
                        "mode": "raw",
                        "raw": json.dumps({
                            "username": "admin",
                            "email": "admin@example.com",
                            "password": "admin123",
                            "adminCode": "admin123"
                        }, indent=2)
                    },
                    "description": "Register the first user as admin"
                }
            },
            # User Login
            {
                "name": "2. Login User",
                "request": {
                    "method": "POST",
                    "header": [
                        {
                            "key": "Content-Type",
                            "value": "application/json"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/auth/login",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "auth", "login"]
                    },
                    "body": {
                        "mode": "raw",
                        "raw": json.dumps({
                            "username": "admin",
                            "password": "admin123"
                        }, indent=2)
                    },
                    "description": "Login and get JWT token"
                }
            },
            # Upload Video
            {
                "name": "3. Upload Video",
                "request": {
                    "method": "POST",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/videos/upload",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "videos", "upload"]
                    },
                    "body": {
                        "mode": "formdata",
                        "formdata": [
                            {
                                "key": "file",
                                "type": "file",
                                "src": "/path/to/your/video.mp4"
                            },
                            {
                                "key": "title",
                                "type": "text",
                                "value": "My Test Video"
                            }
                        ]
                    },
                    "description": "Upload a video file (requires authentication)"
                }
            },
            # Upload Video (VideoService)
            {
                "name": "6. Upload Video (VideoService)",
                "request": {
                    "method": "POST",
                    "header": [
                        {"key": "Authorization", "value": "Bearer {{jwt_token}}"}
                    ],
                    "body": {
                        "mode": "formdata",
                        "formdata": [
                            {"key": "file", "type": "file", "src": "<path-to-video-file>"},
                            {"key": "title", "type": "text", "value": "Test Video"}
                        ]
                    },
                    "url": {
                        "raw": "http://localhost:8081/api/videos/upload",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "videos", "upload"]
                    }
                }
            },
            # List Files
            {
                "name": "4. Get File List",
                "request": {
                    "method": "GET",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/files/list",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "files", "list"]
                    },
                    "description": "List all files (requires authentication)"
                }
            },
            # Stream Video
            {
                "name": "5. Stream Video",
                "request": {
                    "method": "GET",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        },
                        {
                            "key": "Range",
                            "value": "bytes=0-",
                            "description": "Optional byte range for partial content"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/files/1",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "files", "1"]
                    },
                    "description": "Stream a video by ID (adjust ID as needed)"
                }
            },
            # Admin Endpoints
            {
                "name": "6. Get All Users (Admin)",
                "request": {
                    "method": "GET",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/admin/users",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "admin", "users"]
                    },
                    "description": "Get all users (requires admin)"
                }
            },
            # Paginated List Files and Videos
            {
                "name": "7. List All Files and Videos (Paginated)",
                "request": {
                    "method": "GET",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/videos/list_all?page=1&per_page=10",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "videos", "list_all"],
                        "query": [
                            {"key": "page", "value": "1"},
                            {"key": "per_page", "value": "10"}
                        ]
                    },
                    "description": "List all files and videos with pagination (requires authentication)"
                }
            }
        ]
    }
    
    # Create a directory for Postman collections if it doesn't exist
    os.makedirs('postman', exist_ok=True)
    
    # Save the collection to a file
    collection_path = 'postman/secure_media_depot_collection.json'
    with open(collection_path, 'w') as f:
        json.dump(collection, f, indent=2)
    
    print(f"Postman collection saved to: {os.path.abspath(collection_path)}")
    print("Import this file into Postman to test your API")

def print_testing_instructions():
    """Print instructions for testing the application"""
    print_header("Getting Started")
    print("1. Install Python dependencies (or use Docker Compose):")
    print("   pip install -r requirements.txt  # or docker-compose up --build\n")
    
    print("2. Run the Flask application:")
    print("   python app.py  # or docker-compose up\n")
    
    print("3. The server will start on http://localhost:8081\n")
    
    print_header("Testing with Postman")
    print("1. Install Postman from https://www.postman.com/downloads/\n")
    
    print("2. Import the collection from 'postman/secure_media_depot_collection.json'\n")
    
    print("3. Testing Flow:")
    print("   a. Register a user (first user will be admin)")
    print("   b. Login to get a JWT token")
    print("   c. After login, copy the token value from the response")
    print("   d. Create a Postman environment variable named 'token' and paste the value")
    print("   e. Use the 'Upload Video' request to upload a video file")
    print("   f. Use the 'Get File List' or 'List All Files and Videos' request to list uploaded files (now paginated)")
    print("   g. Use the 'Stream Video' request to stream a video file\n")
    
    print_header("Pagination Example")
    print("To test pagination, use the /api/videos/list_all endpoint with ?page=2&per_page=10, e.g.:")
    print("   GET http://localhost:8081/api/videos/list_all?page=2&per_page=10\n")
    
    print_header("Testing File Uploads and Streaming")
    print("1. For video uploads:")
    print("   a. Use the 'Upload Video' request")
    print("   b. Click on 'Body' tab, select 'form-data'")
    print("   c. Add a key 'file' of type 'File' and select a video file to upload")
    print("   d. Add a key 'title' of type 'Text' and provide a title for the video\n")
    
    print("2. For testing video streaming:")
    print("   a. Use the 'Stream Video' request (GET /api/videos/stream/<video_id>)\n")

def print_dummy_data_instructions():
    """Instructions for creating dummy test data"""
    print_header("Creating Test Files")
    print("1. Text file example:")
    print("   echo 'This is a test file' > test.txt\n")
    
    print("2. Generate a dummy video file (requires ffmpeg):")
    print("   ffmpeg -f lavfi -i color=c=blue:s=1280x720:d=5 -c:v libx264 test_video.mp4\n")
    
    print("3. Generate a dummy audio file (requires ffmpeg):")
    print("   ffmpeg -f lavfi -i sine=frequency=1000:duration=5 -c:a aac test_audio.mp3\n")
    
    print("4. You can use any small video file (e.g., .mp4) for testing video uploads.")
    print("5. For file uploads, any file type is accepted.\n")

if __name__ == "__main__":
    print_header("Secure Media Depot - Postman Testing Guide")
    print_testing_instructions()
    print_dummy_data_instructions()
    print_postman_collection()