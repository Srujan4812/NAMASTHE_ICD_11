# NAMASTE-ICD11 Terminology Mapping Platform - Deployment Guide

This guide provides instructions for deploying the NAMASTE ↔ ICD-11 Terminology Mapping Platform with database integration.

## Architecture Overview

The application consists of:
- **Frontend**: Web-based UI built with HTML/CSS/JavaScript and Tailwind CSS
- **Backend**: NestJS API server with FHIR compliance
- **Database**: MongoDB for storing FHIR bundles and terminology data
- **File Storage**: CSV files for primary terminology data

## Deployment Options

### Option 1: Self-Hosted Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose
- At least 2GB RAM available
- Port 3000 and 27017 available

#### Deployment Steps

1. Clone the repository:
```bash
git clone <your-repository-url>
cd namaste-icd11-backend/namaste-icd11-backend/backend
```

2. Build and start the services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. Verify the deployment:
```bash
docker-compose -f docker-compose.prod.yml ps
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Database: MongoDB on port 27017 (internal only)

#### Configuration

The application can be configured using environment variables:

```bash
# In docker-compose.prod.yml
environment:
  - NODE_ENV=production
  - MONGODB_URI=mongodb://mongo:27017/namaste-icd11
  - PORT=3000
```

### Option 2: Cloud Deployment

#### AWS Deployment

1. Create an EC2 instance (t3.medium or larger)
2. Install Docker and Docker Compose
3. Follow the self-hosted deployment steps above

#### Google Cloud Platform

1. Create a Compute Engine instance
2. Install Docker and Docker Compose
3. Follow the self-hosted deployment steps above

#### Azure Deployment

1. Create a Virtual Machine
2. Install Docker and Docker Compose
3. Follow the self-hosted deployment steps above

### Option 3: Container Registry Deployment

For production environments, you can build and push the image to a container registry:

```bash
# Build the image
docker build -t srujan-icd11:latest .

# Tag for your registry
docker tag srujan-icd11:latest <your-registry>/srujan-icd11:latest

# Push to registry
docker push <your-registry>/srujan-icd11:latest
```

## Domain Configuration

To set up a custom domain (e.g., srujan-icd11.com):

1. Purchase a domain name from your preferred registrar
2. Configure DNS to point to your server's IP address
3. Set up SSL/TLS certificates using Let's Encrypt or your preferred CA
4. Update the deployment configuration if needed for HTTPS

For HTTPS with Nginx as a reverse proxy:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

  app:
    # ... existing app configuration ...
```

## Database Configuration

The application uses MongoDB to store:
- FHIR bundles (Patient, Encounter, Condition resources)
- Terminology mappings
- User session data
- Application logs

### Data Persistence

The deployment uses Docker volumes to persist MongoDB data:
```yaml
volumes:
  mongo_data:  # This ensures data persists between container restarts
```

### Backup Strategy

Regular backups should be performed using MongoDB tools:

```bash
# Create a backup
docker exec -t <mongo-container-name> mongodump --out /backup/dump

# Copy backup to host
docker cp <mongo-container-name>:/backup /host/backup/location
```

## Security Considerations

1. **Environment Variables**: Store sensitive data (DB passwords, API keys) in environment variables
2. **Network Security**: Use Docker networks to isolate services
3. **Authentication**: Implement authentication for production use
4. **SSL/TLS**: Always use HTTPS in production
5. **Database Security**: Secure MongoDB with proper authentication

## Monitoring and Maintenance

### Health Checks

The application provides health check endpoints:
- `/health` - Application health status
- MongoDB connection status

### Logging

Logs are available through Docker:
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# View database logs
docker-compose -f docker-compose.prod.yml logs -f mongo
```

### Updates

To update the application:

1. Pull the latest code
2. Rebuild the Docker image
3. Restart the services

```bash
git pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Ensure ports 3000 and 27017 are available
2. **Database Connection**: Check MongoDB is running and accessible
3. **Memory Issues**: Ensure at least 2GB RAM is available
4. **File Permissions**: Ensure the application has read/write access to data directories

### Debugging

```bash
# Check running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs

# Access container shell
docker-compose -f docker-compose.prod.yml exec app sh
```

## Performance Optimization

1. **Caching**: Implement Redis for caching frequently accessed data
2. **CDN**: Use a CDN for static assets
3. **Database Indexing**: Create indexes for frequently queried fields
4. **Load Balancing**: Use multiple instances behind a load balancer for high availability

## Scaling

For high-traffic deployments, consider:
- Multiple application instances behind a load balancer
- Database replication
- CDN for static assets
- Caching layer (Redis)
- Auto-scaling based on load

## Support

For support, please contact the development team or refer to the documentation.