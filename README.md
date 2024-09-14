# secure-media-depot

## Running and Testing the Application

1. Start the Server
In your terminal, start the server:

```bash
npm start
```

You should see:

```plaintext
Server is running on port 3000
```

2. Open the Application in a Browser

Open your web browser.
Navigate to http://localhost:3000/index.html.

3. Register a New User

Since we have no users yet, we'll need to register one. 
You can use a tool like Postman or curl to send a POST request to /register.

Using curl:

```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"password123"}'
```

4. Login

Enter your username and password on the login page.
Upon successful login, you'll be redirected to the upload page.

5. Upload a File

On the upload page, choose a file and click "Upload".
If successful, the file will appear in the list below the form.

6. View or Download Files