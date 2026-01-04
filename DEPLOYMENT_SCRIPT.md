# NAMASTE-ICD11 Deployment Script

This script provides a complete step-by-step guide to deploy the NAMASTE ↔ ICD-11 Terminology Mapping Platform with database integration and custom domain setup.

## Prerequisites

1. A server with Docker and Docker Compose installed
2. A domain name (e.g., srujan-icd11.com)
3. SSL certificate files (cert.pem and key.pem)

## Step 1: Prepare Your Server

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group
sudo usermod -aG docker $USER
```

## Step 2: Clone and Prepare the Application

```bash
# Clone the repository
git clone <your-repository-url>
cd namaste-icd11-backend/namaste-icd11-backend/backend

# Create necessary directories
mkdir -p ssl logs mongo-init
```

## Step 3: Set Up SSL Certificates

```bash
# Copy your SSL certificate files to the ssl directory
cp /path/to/your/cert.pem ssl/
cp /path/to/your/key.pem ssl/
```

## Step 4: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cat > .env << EOF
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
NODE_ENV=production
PORT=3000
EOF
```

## Step 5: Build and Deploy

```bash
# Build and start the services
docker-compose up -d --build

# Check the status
docker-compose ps
```

## Step 6: Configure Domain DNS

Point your domain (srujan-icd11.com) to your server's IP address using your domain registrar's DNS management panel:

- A record: srujan-icd11.com → [your-server-ip]
- A record: www.srujan-icd11.com → [your-server-ip]

## Step 7: Verify the Deployment

```bash
# Check application logs
docker-compose logs -f app

# Check nginx logs
docker-compose logs -f nginx

# Check database logs
docker-compose logs -f mongo
```

## Step 8: Test the Application

Visit https://srujan-icd11.com to access the application.

## Maintenance Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update the application
git pull
docker-compose build --no-cache
docker-compose up -d

# Backup database
docker exec -t <mongo-container-name> mongodump --out /backup/dump
docker cp <mongo-container-name>:/backup /host/backup/location

# View running containers
docker-compose ps
```

## Troubleshooting

### If the application doesn't start:

1. Check if ports 80 and 443 are available:
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

2. Check Docker logs:
```bash
docker-compose logs
```

3. Verify SSL certificate files exist:
```bash
ls -la ssl/
```

### If you get SSL errors:

1. Verify certificate files are valid:
```bash
openssl x509 -in ssl/cert.pem -text -noout
```

### If database connection fails:

1. Check if MongoDB is running:
```bash
docker-compose exec mongo mongo --eval "db.runCommand('ping')"
```

## Security Considerations

1. Use strong passwords for MongoDB
2. Keep SSL certificates updated
3. Regularly update Docker images
4. Monitor access logs
5. Use a firewall to restrict access

## Custom Domain Setup

The application is configured to work with the domain `srujan-icd11.com`. To use a different domain:

1. Update the `nginx.conf` file with your domain name:
```
server_name your-domain.com www.your-domain.com;
```

2. Update your DNS settings to point to your server

3. Ensure your SSL certificates match your domain

## Database Integration

The application uses MongoDB to store:
- FHIR bundles (Patient, Encounter, Condition resources)
- Terminology mappings
- User session data
- Application logs

Data is persisted using Docker volumes and will survive container restarts.

## API Endpoints

- Dashboard: https://srujan-icd11.com/
- Health check: https://srujan-icd11.com/health
- Bundle API: https://srujan-icd11.com/Bundle
- Terminology API: https://srujan-icd11.com/ValueSet/$expand
- Concept Map API: https://srujan-icd11.com/ConceptMap/$translate

## SSL Certificate Renewal

For Let's Encrypt certificates, use certbot:

```bash
# Install certbot
sudo apt install certbot -y

# Renew certificate
sudo certbot renew --dry-run
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker exec -t <mongo-container-name> mongodump --out /backup/dump-$(date +%Y%m%d)

# Copy backup to host
docker cp <mongo-container-name>:/backup /host/backup/location
```

### Application Backup

```bash
# Backup application files
tar -czf app-backup-$(date +%Y%m%d).tar.gz .env docker-compose.yml nginx.conf Dockerfile src/ public/ data/
```

## Performance Tuning

For production environments, consider:

1. Adding Redis for caching
2. Using a CDN for static assets
3. Database indexing
4. Load balancing for high availability
5. Monitoring and alerting

## Support

For support, contact the development team or refer to the application documentation.