# NAMASTE-ICD11 EMR Deployment Guide

This guide provides instructions for deploying the NAMASTE-ICD11 EMR application in different environments.

## Deployment Options

### Option 1: Docker Deployment (Recommended)

This is the easiest way to deploy the application with all dependencies.

#### Prerequisites
- Docker installed
- Docker Compose installed

#### Steps
1. Navigate to the backend directory:
   ```bash
   cd namaste-icd11-backend/backend
   ```

2. Build and start the services:
   ```bash
   docker-compose up -d
   ```

3. The application will be available at `http://localhost:3000`

4. To stop the services:
   ```bash
   docker-compose down
   ```

#### Docker Compose Services
- `app`: The NAMASTE-ICD11 backend application
- `mongodb`: MongoDB database for storing FHIR resources

### Option 2: Manual Deployment

#### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or accessible)

#### Steps
1. Install dependencies:
   ```bash
   cd namaste-icd11-backend/backend
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Set environment variables:
   ```bash
   # Create a .env file with your configuration
   MONGO_URI=mongodb://localhost:27017/namaste
   PORT=3000
   NODE_ENV=production
   ```

4. Start the application:
   ```bash
   npm run start:prod
   ```

### Option 3: Cloud Deployment (Heroku/Render/etc.)

#### For Heroku:
1. Create a `Procfile` in the backend directory:
   ```
   web: npm run start:prod
   ```

2. Set buildpacks:
   - Node.js buildpack

3. Set environment variables in Heroku dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: Port number (Heroku will provide this)
   - `NODE_ENV`: production

#### For Render:
1. Create a web service
2. Set environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: 10000 (Render default)
   - `NODE_ENV`: production
3. Build command: `npm install && npm run build`
4. Start command: `npm run start:prod`

## Configuration

### Environment Variables
- `MONGO_URI`: MongoDB connection string (required)
- `PORT`: Port number for the application (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: URL of the frontend application for CORS (optional)

### Database Initialization
On first run, the application will:
1. Check if NAMASTE terminology exists in MongoDB
2. If not found, it will load from the `data/namaste.csv` file
3. Create the necessary indexes and collections

## Production Considerations

### Security
- Use strong passwords for MongoDB
- Enable authentication for MongoDB
- Use HTTPS in production
- Set appropriate CORS policies
- Validate and sanitize all inputs

### Performance
- Use a production-grade MongoDB instance
- Implement proper indexing
- Consider caching for frequently accessed data
- Monitor application performance

### Backup and Recovery
- Regularly backup MongoDB data
- Test backup restoration procedures
- Consider MongoDB Atlas for managed database service

## Health Checks

The application provides health check endpoints:
- `GET /health`: Basic health check
- `GET /fhir/metadata`: FHIR capability statement

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify MongoDB is running
   - Check MONGO_URI is correct
   - Ensure proper network connectivity

2. **Port Already in Use**
   - Check if another process is using the port
   - Change the PORT environment variable

3. **Application Fails to Start**
   - Check logs for error messages
   - Verify all required environment variables are set
   - Ensure all dependencies are installed

### Useful Commands

```bash
# View application logs
docker-compose logs -f app

# Access MongoDB shell
docker exec -it namaste-icd11-mongodb mongo -u admin -p password

# Run database backup
docker exec namaste-icd11-mongodb mongodump -u admin -p password --out /backup
```

## Scaling

The application is designed to be horizontally scalable:
- Stateless design allows multiple instances
- MongoDB provides data persistence
- Use load balancer for multiple instances