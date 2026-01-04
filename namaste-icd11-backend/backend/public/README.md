# NAMASTE-ICD11 EMR Interface

Welcome to the NAMASTE-ICD11 EMR Interface! This application provides a comprehensive solution for managing AYUSH terminology with ICD-11 mappings.

## Features

### 🌿 Advanced UI with Tailwind CSS
- Modern, responsive design using Tailwind CSS
- Dashboard with statistics and quick reference
- Search interface with enhanced UX
- API documentation page
- Mobile-friendly layout

### 🗂️ Comprehensive NAMASTE Codebase
- 100+ NAMASTE codes loaded from CSV
- Categories: Dravya, Formulation, Therapy, Procedure
- Full search functionality across all codes
- Detailed code information display

### 🔗 Terminology Mapping
- NAMASTE to ICD-11 mapping capabilities
- FHIR R4 compliant API endpoints
- ConceptMap translation service
- Dual coding support

### 📊 Dashboard & Analytics
- Real-time statistics display
- Recent searches tracking
- Code listing with filtering
- Status indicators

### 📝 FHIR Bundle Management
- Create FHIR bundles with Patient, Encounter, and Condition
- Proper resource validation
- Save clinical data with both NAMASTE and ICD-11 codes
- API-driven bundle submission

## Pages

1. **Dashboard** (`dashboard.html`) - Main dashboard with statistics and code listing
2. **Search** (`index.html`) - Advanced search interface for NAMASTE codes
3. **API Docs** (`api-docs.html`) - Complete API documentation

## API Endpoints

### Terminology
- `GET /ValueSet/$expand?filter={search_term}` - Search NAMASTE codes

### Mapping
- `POST /ConceptMap/$translate` - Translate NAMASTE to ICD-11 codes

### Bundle Management
- `POST /Bundle` - Submit FHIR bundles

### Health Check
- `GET /health` - Health status
- `GET /` - Root endpoint

## How to Use

1. Access the application at `http://localhost:3000`
2. Navigate to the Dashboard to see all available codes
3. Use the Search page to find specific NAMASTE codes
4. View ICD-11 mappings when available
5. Save clinical data using the bundle functionality

## Technical Details

- Built with HTML, JavaScript, and Tailwind CSS
- FHIR R4 compliant terminology service
- MongoDB backend for data persistence
- RESTful API design
- Responsive user interface

## Deployment

The application is configured for easy deployment with Docker and docker-compose. See the main `DEPLOYMENT.md` file for detailed instructions.