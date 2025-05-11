from app import create_app
"""
This script serves as the entry point for running the Flask application.
Modules:
    os: Provides a way of using operating system-dependent functionality.
    app: Imports the `create_app` function from the `app` module to initialize the Flask application.
Functions:
    create_app(): Factory function to create and configure the Flask application instance.
Execution:
    When executed as the main program, the script:
    - Reads the `PORT` environment variable to determine the port number (default is 8081).
    - Runs the Flask application on host `0.0.0.0` to make it accessible externally.
    - Enables debug mode for development purposes.
"""

app = create_app()

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8081))
    app.run(host='0.0.0.0', port=port, debug=True)
