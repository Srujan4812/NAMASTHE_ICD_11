# NAMASTE ↔ ICD-11 Terminology Mapping Platform

A comprehensive healthcare terminology mapping system that bridges traditional medicine (NAMASTE) with international medical classifications (ICD-11) using FHIR standards.

## Features

- **Terminology Mapping**: Maps NAMASTE codes to ICD-11 codes
- **FHIR Compliance**: Full compliance with FHIR R4 standards
- **Web Interface**: Modern UI for searching and browsing terminology
- **Bundle Management**: Creates and stores FHIR bundles with Patient, Encounter, and Condition resources
- **Database Integration**: MongoDB for persistent storage
- **CSV Integration**: Loads terminology data from CSV files

## Architecture

- **Frontend**: HTML/CSS/JavaScript with Tailwind CSS
- **Backend**: NestJS API server
- **Database**: MongoDB with Mongoose ODM
- **Standards**: FHIR R4, NAMASTE, ICD-11

## UI Components

1. **Dashboard**: Overview with statistics and system flow
2. **Search & Mapping**: Dual-panel interface for terminology lookup
3. **Terminology Explorer**: Browse and filter terminology
4. **Bulk Mapping**: CSV upload and processing
5. **About**: Documentation and architecture details

## API Endpoints

- `GET /` - Dashboard UI
- `GET /health` - Health check
- `GET /ValueSet/$expand` - Expand terminology valuesets
- `POST /ConceptMap/$translate` - Translate between terminologies
- `POST /Bundle` - Save FHIR bundles
- `GET /Bundle/:id` - Retrieve specific bundle
- `GET /Bundle` - Retrieve all bundles

## Deployment

### Development

```bash
cd namaste-icd11-backend/namaste-icd11-backend/backend
npm install
npm run start:dev
```

Access the application at http://localhost:3000

### Production Deployment

For production deployment with database and custom domain (srujan-icd11.com):

1. Follow the steps in `DEPLOYMENT_SCRIPT.md`
2. Use the Docker Compose configuration in `docker-compose.yml`
3. Configure nginx with SSL certificates as per `nginx.conf`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d --build
```

## Database Integration

The application stores:
- FHIR bundles (Patient, Encounter, Condition resources)
- Terminology mappings
- User session data
- Application logs

## Domain Configuration

The application is configured for the domain `srujan-icd11.com`:
- Dashboard: https://srujan-icd11.com/
- API: https://srujan-icd11.com/api/
- Health: https://srujan-icd11.com/health

## Technology Stack

- **Backend**: NestJS, TypeScript
- **Database**: MongoDB, Mongoose
- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Standards**: FHIR R4, NAMASTE, ICD-11
- **Deployment**: Docker, Docker Compose, Nginx

## FHIR Resources

The application handles these FHIR resources:
- Patient
- Encounter  
- Condition
- Bundle
- CodeSystem
- ValueSet
- ConceptMap

## CSV Data

Terminology data is loaded from `data/namaste.csv` with columns:
- Code
- Display
- Definition
- Synonyms
- Category

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## License

MIT License

## Support

For support, please contact the development team.