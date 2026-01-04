# Connecting Frontend to Backend

This document provides instructions for connecting your frontend application to this backend API.

## Backend Configuration

The backend is configured to:
- Run on port 3000 (can be changed via the PORT environment variable)
- Allow CORS requests from `http://localhost:3000` (the default frontend URL)
- Connect to MongoDB at the URI specified in the `.env` file

## Environment Variables

The following environment variables are used:

- `PORT`: The port on which the backend server runs (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `FRONTEND_URL`: The URL of your frontend application for CORS (default: http://localhost:3000)

## API Endpoints

- `GET /` - Returns "Hello World!"
- `GET /health` - Returns health check information

## Frontend Connection Guide

To connect your frontend application to this backend:

1. Make sure the backend is running:
   ```bash
   npm run start:dev
   ```

2. In your frontend application, make API calls to `http://localhost:3000` or the appropriate backend URL

3. Example fetch request:
   ```javascript
   // Health check
   fetch('http://localhost:3000/health')
     .then(response => response.json())
     .then(data => console.log(data));
   
   // Hello endpoint
   fetch('http://localhost:3000/')
     .then(response => response.text())
     .then(data => console.log(data));
   ```

4. If your frontend runs on a different port, update the `FRONTEND_URL` in your `.env` file and restart the backend.

## Troubleshooting

- If you get CORS errors, ensure that the `FRONTEND_URL` in your `.env` file matches your frontend's URL
- Make sure MongoDB is running before starting the backend
- Check that the ports are not blocked by firewall settings