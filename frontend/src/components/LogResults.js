import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, AlertTriangle, Info, AlertCircle, Bug } from 'lucide-react';
import './LogResults.css';

const LogResults = ({ logs, loading, pagination, onPageChange }) => {
  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <AlertCircle size={16} />;
      case 'warn':
        return <AlertTriangle size={16} />;
      case 'info':
        return <Info size={16} />;
      case 'debug':
        return <Bug size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getLevelClass = (level) => {
    return `log-level-${level}`;
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="log-results card">
        <div className="loading">Loading logs...</div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="log-results card">
        <div className="no-logs">
          <Info size={48} />
          <h3>No logs found</h3>
          <p>Try adjusting your filters or add some logs to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="log-results">
      <div className="results-header">
        <h3>Log Entries</h3>
        <div className="results-count">
          Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
        </div>
      </div>

      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Timestamp</th>
              <th>Message</th>
              <th>Resource ID</th>
              <th>Trace ID</th>
              <th>Span ID</th>
              <th>Commit</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className={`log-row ${getLevelClass(log.level)}`}>
                <td className="log-level">
                  <span className={`level-badge ${getLevelClass(log.level)}`}>
                    {getLevelIcon(log.level)}
                    {log.level.toUpperCase()}
                  </span>
                </td>
                <td className="log-timestamp">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="log-message">
                  <div className="message-content">
                    {truncateText(log.message)}
                    {log.message.length > 100 && (
                      <span className="message-full" title={log.message}>
                        {log.message}
                      </span>
                    )}
                  </div>
                </td>
                <td className="log-resource">
                  <code>{log.resourceId}</code>
                </td>
                <td className="log-trace">
                  <code>{log.traceId}</code>
                </td>
                <td className="log-span">
                  <code>{log.spanId}</code>
                </td>
                <td className="log-commit">
                  <code>{log.commit}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="page-info">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          
          <button
            className="btn btn-secondary"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LogResults; 