import { useState, useEffect } from "react";

const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");

  // Fetch alerts from backend
  const getNotifications = async () => {
    const url = "http://localhost:3500/api/v1/notifications/";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      // Convert timestamps to Date objects (if needed)
      const formattedData = data.data.map(alert => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      }));

      setAlerts(formattedData);
    } catch (error) {
      console.error("Failed to fetch alerts:", error.message);
    }
  };

  useEffect(() => {
    getNotifications(); // fetch from backend
  }, []);

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAndSortedAlerts = alerts
    .filter((alert) => filterStatus === "all" || alert.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "timestamp") {
        return b.timestamp - a.timestamp;
      } else if (sortBy === "severity") {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      } else if (sortBy === "status") {
        const statusOrder = { active: 3, monitoring: 2, resolved: 1 };
        return statusOrder[b.status] - statusOrder[a.status];
      }
      return 0;
    });

  const getAlertSummary = () => {
    const active = alerts.filter(a => a.status === 'active').length;
    const monitoring = alerts.filter(a => a.status === 'monitoring').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    return { active, monitoring, resolved, total: alerts.length };
  };

  const summary = getAlertSummary();

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h3>Travel Risk Alerts Dashboard</h3>
        <div className="alerts-filters">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="timestamp">Sort by Date</option>
            <option value="severity">Sort by Severity</option>
            <option value="status">Sort by Status</option> 
          </select>
        </div>
      </div>

      <div className="alerts-list">
        {filteredAndSortedAlerts.map((alert) => (
          <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
            <div className="alert-content">
              <div className="alert-main-info">
                <div className="alert-title-tags">
                  <h4>{alert.title}</h4>
                  <span className={`tag severity-tag-${alert.severity}`}>{alert.severity}</span>
                  <span className={`tag status-tag-${alert.status}`}>{alert.status}</span>
                </div>
                <p className="alert-description">{alert.description}</p>
                <div className="alert-timestamp">
                  <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTimestamp(alert.timestamp)}
                </div>
              </div>
              <div className="alert-actions">
                {alert.status === 'active' && (
                  <>
                    <button className="btn-alert btn-monitor">Monitor</button>
                    <button className="btn-alert btn-resolve">Resolve</button>
                  </>
                )}
                {alert.status === 'monitoring' && (
                  <>
                    <button className="btn-alert btn-activate">Activate</button>
                    <button className="btn-alert btn-resolve">Resolve</button>
                  </>
                )}
                {alert.status === 'resolved' && (
                    <button className="btn-alert btn-re-activate">Re-Activate</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alerts-summary">
        <h4>Alert Summary</h4>
        <div className="summary-grid">
            <div className="summary-item">
                <div className="summary-count count-active">{summary.active}</div>
                <div className="summary-label">Active</div>
            </div>
            <div className="summary-item">
                <div className="summary-count count-monitoring">{summary.monitoring}</div>
                <div className="summary-label">Monitoring</div>
            </div>
            <div className="summary-item">
                <div className="summary-count count-resolved">{summary.resolved}</div>
                <div className="summary-label">Resolved</div>
            </div>
            <div className="summary-item">
                <div className="summary-count count-total">{summary.total}</div>
                <div className="summary-label">Total</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsDashboard;
