const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6000;
const LOG_FILE = path.join(__dirname, 'data', 'logs.json');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Read logs from JSON file
async function readLogs() {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write logs to JSON file
async function writeLogs(logs) {
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
}

// Validate log entry
function validateLogEntry(log) {
  const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit'];
  const validLevels = ['error', 'warn', 'info', 'debug'];
  
  for (const field of requiredFields) {
    if (!log[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (!validLevels.includes(log.level)) {
    throw new Error(`Invalid level. Must be one of: ${validLevels.join(', ')}`);
  }
  
  // Validate timestamp format (ISO 8601) - more flexible
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
  if (!timestampRegex.test(log.timestamp)) {
    throw new Error('Invalid timestamp format. Must be ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss)');
  }
  
  return true;
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ingest log entry
app.post('/api/logs', async (req, res) => {
  try {
    const logEntry = req.body;
    
    // Validate the log entry
    validateLogEntry(logEntry);
    
    // Read existing logs
    const logs = await readLogs();
    
    // Add new log entry
    logs.push({
      ...logEntry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    });
    
    // Write back to file
    await writeLogs(logs);
    
    res.status(201).json({ 
      message: 'Log entry created successfully',
      id: logs[logs.length - 1].id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Query logs with filters
app.get('/api/logs', async (req, res) => {
  try {
    const {
      search,
      level,
      resourceId,
      startTime,
      endTime,
      page = 1,
      limit = 50
    } = req.query;
    
    let logs = await readLogs();
    
    // Apply filters
    if (search) {
      logs = logs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (level) {
      const levels = level.split(',');
      logs = logs.filter(log => levels.includes(log.level));
    }
    
    if (resourceId) {
      logs = logs.filter(log => 
        log.resourceId.toLowerCase().includes(resourceId.toLowerCase())
      );
    }
    
    if (startTime) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(startTime));
    }
    
    if (endTime) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(endTime));
    }
    
    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedLogs = logs.slice(startIndex, endIndex);
    
    res.json({
      logs: paginatedLogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: logs.length,
        totalPages: Math.ceil(logs.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get log levels for filter dropdown
app.get('/api/logs/levels', async (req, res) => {
  try {
    const logs = await readLogs();
    const levels = [...new Set(logs.map(log => log.level))];
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource IDs for filter dropdown
app.get('/api/logs/resources', async (req, res) => {
  try {
    const logs = await readLogs();
    const resources = [...new Set(logs.map(log => log.resourceId))];
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize data directory and start server
async function startServer() {
  await ensureDataDirectory();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Log file location: ${LOG_FILE}`);
  });
}

startServer().catch(console.error); 