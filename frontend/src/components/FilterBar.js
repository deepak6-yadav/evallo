import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, X } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange }) => {
  const [levels, setLevels] = useState([]);
  const [resources, setResources] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const [levelsResponse, resourcesResponse] = await Promise.all([
        axios.get('/api/logs/levels'),
        axios.get('/api/logs/resources')
      ]);
      setLevels(levelsResponse.data);
      setResources(resourcesResponse.data);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      level: '',
      resourceId: '',
      startTime: '',
      endTime: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="filter-bar card">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={20} />
          <h3>Filter Logs</h3>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>
      </div>

      <div className="filter-main">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search log messages..."
              value={localFilters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Log Level</label>
                <select
                  className="select"
                  value={localFilters.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                >
                  <option value="">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Resource ID</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter resource ID..."
                  value={localFilters.resourceId}
                  onChange={(e) => handleInputChange('resourceId', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={localFilters.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={localFilters.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              <X size={16} />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 