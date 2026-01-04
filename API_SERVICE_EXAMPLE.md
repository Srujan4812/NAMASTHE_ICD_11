# API Service Example for Frontend

This document provides an example of how to create an API service in your frontend application to connect to the backend.

## Basic API Service

Here's an example of how to create an API service in JavaScript/TypeScript that connects to your backend:

```javascript
// apiService.js or apiService.ts

class ApiService {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check endpoint
  async getHealth() {
    return this.request('/health');
  }

  // Example: Get hello message
  async getHello() {
    return this.request('/');
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;
```

## Usage in Components

```javascript
// Example usage in a React component or vanilla JavaScript

import apiService from './apiService';

// In your component or function
async function checkBackendConnection() {
  try {
    const health = await apiService.getHealth();
    console.log('Backend health:', health);
    
    const hello = await apiService.getHello();
    console.log('Hello message:', hello);
  } catch (error) {
    console.error('Error connecting to backend:', error);
  }
}

// Call the function to test the connection
checkBackendConnection();
```

## React Hook Example

```javascript
// useApi.js
import { useState, useEffect } from 'react';
import apiService from './apiService';

export const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiService.request(endpoint);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

// Usage in a component
// import { useApi } from './useApi';
// 
// function HealthCheck() {
//   const { data, loading, error } = useApi('/health');
// 
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
// 
//   return (
//     <div>
//       <h2>Backend Status: {data?.status}</h2>
//       <p>Timestamp: {data?.timestamp}</p>
//     </div>
//   );
// }
```

## Environment-Based Configuration

For different environments (development, staging, production), you can use environment variables:

```javascript
// config.js
const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://yourdomain.com/api'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_CONFIG = config[environment];
```

Then use it in your API service:

```javascript
// apiService.js
import { API_CONFIG } from './config';

class ApiService {
  constructor(baseURL = API_CONFIG.apiUrl) {
    this.baseURL = baseURL;
  }
  
  // ... rest of the implementation
}
```

## Error Handling

For better error handling in your frontend application:

```javascript
// errorHandler.js
export const handleApiError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error: Please check your connection to the backend';
  }
  
  if (error.message.includes('404')) {
    return 'Resource not found';
  }
  
  if (error.message.includes('500')) {
    return 'Server error: Please try again later';
  }
  
  return error.message || 'An unknown error occurred';
};
```

## Testing the Connection

To test if your frontend can connect to the backend, you can create a simple test function:

```javascript
// testConnection.js
import apiService from './apiService';

export const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    const health = await apiService.getHealth();
    console.log('✅ Connection successful!', health);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
};
```

This example provides a solid foundation for connecting your frontend application to the backend API.