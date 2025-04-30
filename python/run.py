#!/usr/bin/env python3
"""
Secure Media Depot Runner

This script provides a convenient way to run the application.
"""
import os
import sys
from dotenv import load_dotenv
from app import app

# Add the current directory to the path if running as executable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def main():
    """Run the Flask application with environment settings"""
    port = int(os.environ.get('PORT', 8081))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    print(f"Starting Secure Media Depot on http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

if __name__ == '__main__':
    main()