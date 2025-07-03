# Evallo Log Manager

A full-stack log management system built with React frontend and Node.js/Express backend. The system allows you to ingest, search, filter, and view application logs with a modern, responsive interface.

## Features

### Backend (Log Ingestor)
- **RESTful API** built with Node.js and Express
- **JSON file persistence** - no external database required
- **Log validation** with proper schema enforcement
- **Filtering and search** capabilities
- **Pagination** support for large datasets
- **CORS enabled** for frontend integration

### Frontend (Log Query Interface)
- **Modern React UI** with responsive design
- **Advanced filtering** with multiple criteria
- **Real-time search** on log messages
- **Visual log level indicators** with color coding
- **Pagination** for better performance
- **Log ingestion form** for adding new entries

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React 18, Axios, Lucide React Icons
- **Styling**: CSS3 with modern design patterns
- **Data Persistence**: JSON file storage
- **Development**: Concurrently for running both servers

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evallo
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 6000) and frontend development server (port 3000).

## API Documentation

### Base URL
```
http://localhost:6000/api
```

### Endpoints

#### 1. Health Check
```
GET /api/health
```

#### 2. Ingest Log Entry
```
POST /api/logs
```

#### 3. Query Logs
```
GET /api/logs?search=text&level=error&resourceId=server&startTime=2023-09-15T00:00:00Z&endTime=2023-09-15T23:59:59Z&page=1&limit=50
```

#### 4. Get Log Levels
```
GET /api/logs/levels
```

#### 5. Get Resource IDs
```
GET /api/logs/resources
```

## Log Schema

All log entries must follow this schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| level | String | Yes | One of: error, warn, info, debug |
| message | String | Yes | Primary log message |
| resourceId | String | Yes | Resource identifier |
| timestamp | String | Yes | ISO 8601 formatted timestamp |
| traceId | String | Yes | Unique trace identifier |
| spanId | String | Yes | Unique span identifier |
| commit | String | Yes | Git commit hash |
| metadata | Object | No | Additional context data |

## Features in Detail

### Visual Log Level Indicators
- **Error**: Red border and background
- **Warning**: Orange border and background  
- **Info**: Blue border and background
- **Debug**: Gray border and background

### Advanced Filtering
- **Text Search**: Full-text search on log messages
- **Level Filter**: Dropdown with available log levels
- **Resource Filter**: Text input for resource ID
- **Time Range**: Start and end timestamp pickers
- **Real-time Updates**: Filters apply automatically

## Development

### Running Individual Servers

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm start
```

**Add sample data (optional):**
```bash
cd backend
node sample-data.js
```

### Building for Production
```bash
npm run build
```

## Data Persistence

The application uses a single JSON file (`backend/data/logs.json`) for data storage. This file is created automatically when the first log entry is added.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
