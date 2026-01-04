# Full-Stack Setup Instructions

This document provides instructions for setting up and running the full-stack application with both frontend and backend.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or accessible)
- npm or yarn package manager

## Project Structure

```
workspace/
├── namaste-icd11-backend/     # Backend NestJS application
│   └── backend/              # NestJS source code
├── lumina-clinical-main/     # Frontend application
└── package.json              # Root package.json for full-stack management
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd namaste-icd11-backend/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/namaste
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run start:dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd lumina-clinical-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the frontend to connect to the backend by setting up environment variables or API configuration:
   - Ensure API calls are made to `http://localhost:3000` (or your backend URL)
   - Example: In your frontend API service, use base URL `http://localhost:3000`

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 3. Running Both Together

You can run both the frontend and backend simultaneously using the root package.json:

1. From the root directory, install dependencies:
   ```bash
   npm run install-all
   ```

2. Run both servers together:
   ```bash
   npm run dev
   ```

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Main endpoint returning "Hello World!"
- `GET /health` - Health check endpoint returning status and timestamp
- Other endpoints as defined in the various modules (terminology, fhir, bundle)

## Environment Configuration

### Backend Environment Variables

- `PORT` - Port for the backend server (default: 3000)
- `MONGO_URI` - MongoDB connection string
- `FRONTEND_URL` - URL of the frontend for CORS configuration

### Frontend Configuration

Configure your frontend to make API calls to the backend:

```javascript
// Example API configuration
const API_BASE_URL = 'http://localhost:3000'; // Backend URL

// Example fetch call
fetch(`${API_BASE_URL}/health`)
  .then(response => response.json())
  .then(data => console.log(data));
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the `FRONTEND_URL` in your backend `.env` file matches your frontend's URL.

2. **Connection Refused**: Ensure both servers are running and on the correct ports.

3. **MongoDB Connection**: Verify MongoDB is running and the connection string is correct.

### Testing the Connection

1. Verify the backend is running by visiting: `http://localhost:3000/health`
2. You should receive a JSON response with status and timestamp
3. Check that the frontend can make requests to the backend

## Development Workflow

1. Start the backend server first
2. Then start the frontend server
3. Make sure to restart the backend if you make changes to the environment variables
4. Both servers should run simultaneously during development

## Production Deployment

For production deployment:

1. Update the environment variables with production values
2. Use a production-grade MongoDB instance
3. Configure proper domain names and SSL certificates
4. Set up reverse proxy if needed (nginx, etc.)