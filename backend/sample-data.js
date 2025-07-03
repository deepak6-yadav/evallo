const fs = require('fs').promises;
const path = require('path');

const LOG_FILE = path.join(__dirname, 'data', 'logs.json');

const sampleLogs = [
  {
    level: 'error',
    message: 'Database connection failed: Connection timeout after 30 seconds',
    resourceId: 'web-server-01',
    timestamp: '2023-09-15T08:00:00Z',
    traceId: 'trace-abc-123',
    spanId: 'span-456',
    commit: '5e5342f',
    metadata: { retryCount: 3, timeout: 30000 }
  },
  {
    level: 'warn',
    message: 'High memory usage detected: 85% of available memory in use',
    resourceId: 'api-server-02',
    timestamp: '2023-09-15T08:15:30Z',
    traceId: 'trace-def-456',
    spanId: 'span-789',
    commit: '7a8b9c1',
    metadata: { memoryUsage: '85%', threshold: '80%' }
  },
  {
    level: 'info',
    message: 'User authentication successful for user: john.doe@example.com',
    resourceId: 'auth-service-01',
    timestamp: '2023-09-15T08:30:45Z',
    traceId: 'trace-ghi-789',
    spanId: 'span-012',
    commit: '3f4e5d6',
    metadata: { userId: '12345', method: 'oauth2' }
  },
  {
    level: 'debug',
    message: 'Processing request: GET /api/users/12345',
    resourceId: 'api-gateway-01',
    timestamp: '2023-09-15T08:45:12Z',
    traceId: 'trace-jkl-012',
    spanId: 'span-345',
    commit: '9a1b2c3',
    metadata: { method: 'GET', path: '/api/users/12345', duration: '45ms' }
  },
  {
    level: 'error',
    message: 'Payment processing failed: Invalid credit card number',
    resourceId: 'payment-service-01',
    timestamp: '2023-09-15T09:00:00Z',
    traceId: 'trace-mno-345',
    spanId: 'span-678',
    commit: '4d5e6f7',
    metadata: { errorCode: 'INVALID_CARD', amount: 99.99 }
  },
  {
    level: 'info',
    message: 'Email notification sent successfully to: admin@company.com',
    resourceId: 'notification-service-01',
    timestamp: '2023-09-15T09:15:22Z',
    traceId: 'trace-pqr-678',
    spanId: 'span-901',
    commit: '8g9h0i1',
    metadata: { recipient: 'admin@company.com', template: 'alert' }
  },
  {
    level: 'warn',
    message: 'Slow query detected: SELECT * FROM users WHERE email LIKE %@% took 2.5s',
    resourceId: 'database-server-01',
    timestamp: '2023-09-15T09:30:15Z',
    traceId: 'trace-stu-901',
    spanId: 'span-234',
    commit: '2j3k4l5',
    metadata: { queryTime: '2.5s', threshold: '1s', table: 'users' }
  },
  {
    level: 'debug',
    message: 'Cache miss for key: user_profile_12345, fetching from database',
    resourceId: 'cache-server-01',
    timestamp: '2023-09-15T09:45:33Z',
    traceId: 'trace-vwx-234',
    spanId: 'span-567',
    commit: '6m7n8o9',
    metadata: { cacheKey: 'user_profile_12345', ttl: 3600 }
  }
];

async function addSampleData() {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
    
    // Check if logs file already exists
    let existingLogs = [];
    try {
      const data = await fs.readFile(LOG_FILE, 'utf8');
      existingLogs = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
    }
    
    // Add sample logs with unique IDs
    const logsWithIds = sampleLogs.map((log, index) => ({
      ...log,
      id: `sample-${Date.now()}-${index}`
    }));
    
    // Combine existing and sample logs
    const allLogs = [...existingLogs, ...logsWithIds];
    
    // Write to file
    await fs.writeFile(LOG_FILE, JSON.stringify(allLogs, null, 2));
    
    console.log(`✅ Added ${sampleLogs.length} sample log entries`);
    console.log(`📁 Log file location: ${LOG_FILE}`);
    console.log(`📊 Total logs: ${allLogs.length}`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  addSampleData();
}

module.exports = { addSampleData }; 