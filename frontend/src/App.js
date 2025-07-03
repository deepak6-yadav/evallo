import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from './components/FilterBar';
import LogResults from './components/LogResults';
import LogIngestor from './components/LogIngestor';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    resourceId: '',
    startTime: '',
    endTime: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  const fetchLogs = async (filterParams = filters, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      // Add pagination
      params.append('page', page);
      params.append('limit', pagination.limit);
      
      const response = await axios.get(`/api/logs?${params.toString()}`);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchLogs(newFilters, 1);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchLogs(filters, newPage);
  };

  const handleLogIngested = () => {
    // Refresh logs after new log is ingested
    fetchLogs(filters, pagination.page);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>Evallo Log Manager</h1>
          <p>Search, filter, and view your application logs</p>
        </div>
      </header>

      <main className="container">
        <LogIngestor onLogIngested={handleLogIngested} />
        
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <LogResults 
          logs={logs}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

export default App; 