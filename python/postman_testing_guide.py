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
            # Get User Profile
            {
                "name": "3. Get User Profile",
                "request": {
                    "method": "GET",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/users/profile",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "users", "profile"]
                    },
                    "description": "Get user profile (requires authentication)"
                }
            },
            # File Upload
            {
                "name": "4. Upload File",
                "request": {
                    "method": "POST",
                    "header": [
                        {
                            "key": "Authorization",
                            "value": "Bearer {{token}}"
                        }
                    ],
                    "url": {
                        "raw": "http://localhost:8081/api/files/upload",
                        "protocol": "http",
                        "host": ["localhost"],
                        "port": "8081",
                        "path": ["api", "files", "upload"]
                    },
                    "body": {
                        "mode": "formdata",
                        "formdata": [
                            {
                                "key": "file",
                                "type": "file",
                                "src": "/path/to/your/file.mp4"
                            }
                        ]
                    },
                    "description": "Upload a file (requires authentication)"
                }
            },
            # List Files
            {
                "name": "5. Get File List",
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
                "name": "6. Stream Video",
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
                "name": "7. Get All Users (Admin)",
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
    print("1. Install Python dependencies:")
    print("   pip install -r requirements.txt\n")
    
    print("2. Run the Flask application:")
    print("   python app.py\n")
    
    print("3. The server will start on http://localhost:8081\n")
    
    print_header("Testing with Postman")
    print("1. Install Postman from https://www.postman.com/downloads/\n")
    
    print("2. Import the collection from 'postman/secure_media_depot_collection.json'\n")
    
    print("3. Testing Flow:")
    print("   a. Register a user (first user will be admin)")
    print("   b. Login to get a JWT token")
    print("   c. After login, copy the token value from the response")
    print("   d. Create a Postman environment variable named 'token' and paste the value")
    print("   e. Now you can call the other endpoints that require authentication\n")
    
    print_header("Testing File Uploads and Streaming")
    print("1. For file uploads:")
    print("   a. Use the 'Upload File' request")
    print("   b. Click on 'Body' tab, select 'form-data'")
    print("   c. Add a key 'file' of type 'File' and select a file to upload\n")
    
    print("2. For testing video streaming:")
    print("   a. First upload a video file using the upload endpoint")
    print("   b. Get the file ID from the file list endpoint")
    print("   c. Use the 'Stream Video' request, replacing '1' with your file ID")
    print("   d. You can test partial content by adding a 'Range' header\n")
    
    print("3. To test in a browser (after getting a token):")
    print("   a. Use a browser extension to set Authorization header")
    print("   b. Navigate to http://localhost:8081/api/files/{fileId}")
    print("   c. For videos, the browser will automatically use byte ranges\n")

def print_dummy_data_instructions():
    """Instructions for creating dummy test data"""
    print_header("Creating Test Files")
    print("1. Text file example:")
    print("   echo 'This is a test file' > test.txt\n")
    
    print("2. Generate a dummy video file (requires ffmpeg):")
    print("   ffmpeg -f lavfi -i color=c=blue:s=1280x720:d=5 -c:v libx264 test_video.mp4\n")
    
    print("3. Generate a dummy audio file (requires ffmpeg):")
    print("   ffmpeg -f lavfi -i sine=frequency=1000:duration=5 -c:a aac test_audio.mp3\n")
    
if __name__ == "__main__":
    print_header("Secure Media Depot - Postman Testing Guide")
    print_testing_instructions()
    print_dummy_data_instructions()
    print_postman_collection()