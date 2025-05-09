# Secure Media Depot (Python)

A secure media storage and streaming platform built with Flask, designed with object-oriented principles for maintainability and scalability. This implementation follows best practices for web application development including separation of concerns, modular design, and security.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Media Streaming**: Robust video streaming with byte range support for seeking functionality
- **File Management**: Upload, search, retrieve, and delete various types of media files
- **User Management**: Admin controls for user approval and management
- **Security**: Password hashing, secure file handling, and protected routes
- **Modern UI**: Clean, responsive interface with separated CSS and JavaScript

## Architecture

The application is built using a layered architecture pattern:

- **Controllers**: Handle HTTP requests/responses and business logic
- **Models**: SQLAlchemy ORM classes for data persistence
- **Services**: Reusable components like JWT authentication
- **Middleware**: Cross-cutting concerns like authentication
- **Templates**: Jinja2 templates for HTML rendering
- **Static Assets**: Separated CSS and JavaScript files

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/secure-media-depot.git
   cd secure-media-depot/python
   ```

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS and Linux
   source venv/bin/activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root with the following variables:
   ```
   SECRET_KEY=your_secret_key_here
   JWT_SECRET_KEY=your_jwt_secret_here
   ADMIN_CODE=admin123
   UPLOAD_FOLDER=uploads
   DATABASE_URL=sqlite:///media.db
   PORT=8081
   ```

5. Create the uploads directory
   ```bash
   mkdir uploads
   ```

## Running and Testing the Application

### Running the Application

1. Start the server using the provided runner script:
   ```powershell
   python run.py
   ```
   This will launch the Flask app using the configuration in `app.py` and environment variables from your `.env` file. The application will be available at `http://localhost:8081` by default.

### Running Tests

Basic tests for the video model and service are included in `test_video_service.py`.

To run the tests:
```powershell
python test_video_service.py
```
This will run a simple test that creates a dummy video row in an in-memory SQLite database and verifies its existence.

---

## Web Interface

The application provides several web pages for user interaction:

- **Home Page** (`/`): Introduction and feature showcase
- **Login** (`/login`): User authentication
- **Registration** (`/register`): New user registration
- **Video Player** (`/player`): Media streaming interface

## API Documentation

### Authentication

- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/logout` - Logout (clears token on client)

### User Management

- `POST /api/users/register` - Register a new user
- `GET /api/users/profile` - Get current user profile

### File Operations

- `POST /api/files/upload` - Upload a file
- `GET /api/files/list` - Get list of all files
- `GET /api/files/{id}` - Get a specific file (stream or download)
- `DELETE /api/files/{id}` - Delete a file
- `GET /api/files/search?query={term}` - Search for files

### Admin Operations

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/pending` - Get pending users
- `GET /api/admin/users/registered` - Get registered users
- `PATCH /api/admin/approve/{userId}` - Approve a user
- `PATCH /api/admin/deny/{userId}` - Deny a user
- `GET /api/admin/user/{userId}` - Get a specific user

## Frontend Structure

The frontend is built using vanilla HTML, CSS, and JavaScript:

### CSS Structure

- `main.css` - Common styles shared across all pages
- `home.css` - Home page specific styles
- `video-player.css` - Video player specific styles

### JavaScript Structure

- `home.js` - Home page functionality
- `login.js` - Authentication handling
- `register.js` - User registration functionality
- `video-player.js` - Media streaming and file management

## Testing

The project includes a testing guide with a Postman collection for API testing:

```bash
python postman_testing_guide.py
```

This will generate helpful instructions and a Postman collection in the `postman/` directory that you can import into Postman.

## Security Considerations

- JWT tokens expire after 1 hour for security
- Passwords are hashed using bcrypt
- Input validation is performed on all inputs
- File names are sanitized to prevent path traversal attacks
- Admin routes are protected with role-based authorization
- Content-Type is validated for uploads

## Project Structure

```
python/
├── app.py                  # Main Flask application
├── run.py                  # Application runner
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (not tracked by git)
├── auth/                   # Authentication middleware
├── controllers/            # API controllers
├── models/                 # Database models
├── services/               # Reusable services
├── static/                 # Static assets
│   ├── css/                # Stylesheets
│   └── js/                 # JavaScript files
├── templates/              # HTML templates
└── uploads/                # Upload directory for files
```

## Contributing

1. Create a new branch for your feature
2. Implement your changes
3. Write or update tests
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

- If you experience database issues, try deleting the `media.db` file and restart the application to recreate it
- For file upload issues, check that the `uploads` directory exists and is writable
- If authentication fails, ensure your JWT_SECRET_KEY is properly set in `.env`
- If static files aren't loading, check that your Flask application is correctly serving files from the static directory