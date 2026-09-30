
import { useEffect, useState } from "react";
import {
  AlertTriangle, RefreshCw, Search, Eye
} from "lucide-react";
import { getAlerts, updateAlertStatus } from "../services/api";

function Alerts({ onInvestigate }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  async function loadAlerts() {
    try {
      setLoading(true);
      setError("");
      const data = await getAlerts();
      setAlerts(Array.isArray(data) ? data : data.alerts || []);
    } catch (err) {
      setError(err.message || "Unable to load alerts.");
    } finally {
      setLoading(false);
    }
  }
  async function changeStatus(status) {
  if (!selectedAlert) return;

  try {
    setUpdating(true);
    setActionMessage("");

    const response = await updateAlertStatus(
      selectedAlert.id,
      status
    );

    const updatedAlert = response.alert;

    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === updatedAlert.id ? updatedAlert : alert
      )
    );

    setSelectedAlert(updatedAlert);
    setActionMessage(`Alert status changed to ${status}.`);
  } catch (err) {
    setActionMessage(err.message || "Status update failed.");
  } finally {
    setUpdating(false);
  }
}

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const text = [
      alert.title,
      alert.id,
      alert.description,
      alert.source,
      alert.severity,
      alert.status
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesSeverity =
      severity === "All" ||
      String(alert.severity || "").toLowerCase() === severity.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  return (
    <div>
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">Security Alerts</h1>
          <p className="page-subtitle">
            Review simulated detections and investigate related cases.
          </p>
        </div>
        <button className="secondary-button" onClick={loadAlerts}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="alert-summary-grid">
        <div className="panel alert-summary-card">
          <span className="muted">Total Alerts</span>
          <strong>{alerts.length}</strong>
        </div>
        <div className="panel alert-summary-card">
          <span className="muted">High Severity</span>
          <strong>
            {alerts.filter((a) =>
              String(a.severity).toLowerCase() === "high"
            ).length}
          </strong>
        </div>
        <div className="panel alert-summary-card">
          <span className="muted">Critical Severity</span>
          <strong>
            {alerts.filter((a) =>
              String(a.severity).toLowerCase() === "critical"
            ).length}
          </strong>
        </div>
      </div>

      <div className="panel alert-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search alerts..."
          />
        </div>

        <select
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        >
          <option>All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {loading && <div className="panel">Loading alerts...</div>}

      {error && (
        <div className="panel error-message">
          {error}
          <button className="secondary-button" onClick={loadAlerts}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="panel alert-table-panel">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.id}</td>
                    <td>
                      <strong>{alert.title || "Untitled Alert"}</strong>
                      <div className="muted table-subtext">
                        {alert.description || ""}
                      </div>
                    </td>
                    <td>
                      <span className={`severity-badge ${String(alert.severity || "low").toLowerCase()}`}>
                        {alert.severity || "Low"}
                      </span>
                    </td>
                    <td>{alert.source || alert.sourceIp || "—"}</td>
                    <td>{alert.status || "New"}</td>
                    <td>
                      <button
                        className="table-action-button"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Eye size={15} /> Investigate
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No matching alerts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selectedAlert && (
  <div className="alert-modal-backdrop">
    <div className="panel alert-modal">
      <div className="alert-modal-heading">
        <div>
          <span className="muted">{selectedAlert.id}</span>
          <h2>{selectedAlert.title || "Alert Details"}</h2>
        </div>
        <button
          className="secondary-button"
          onClick={() => setSelectedAlert(null)}
        >
          Close
        </button>
      </div>

      <div className="alert-detail-grid">
        <div>
          <span className="muted">Severity</span>
          <strong>{selectedAlert.severity || "Unknown"}</strong>
        </div>
        <div>
          <span className="muted">Status</span>
          <strong>{selectedAlert.status || "New"}</strong>
        </div>
        <div>
          <span className="muted">Source</span>
          <strong>{selectedAlert.source || selectedAlert.sourceIp || "—"}</strong>
        </div>
        <div>
          <span className="muted">Related Case</span>
          <strong>{selectedAlert.caseId || selectedAlert.case_id || "Not linked"}</strong>
        </div>
      </div>

      <div className="alert-detail-description">
        <h3>Description</h3>
        <p>{selectedAlert.description || "No description provided."}</p>
      </div>

      <button
        className="primary-button"
        onClick={() => {
          const id = selectedAlert.caseId || selectedAlert.case_id;
          setSelectedAlert(null);
          if (id) onInvestigate({ ...selectedAlert, caseId: id });
        }}
        disabled={!selectedAlert.caseId && !selectedAlert.case_id}
      >
        Investigate Related Case
      </button>
      <div className="alert-status-actions">
  <button
    className="secondary-button"
    disabled={updating || selectedAlert.status === "Acknowledged"}
    onClick={() => changeStatus("Acknowledged")}
  >
    Acknowledge
  </button>

  <button
    className="resolve-button"
    disabled={updating || selectedAlert.status === "Resolved"}
    onClick={() => changeStatus("Resolved")}
  >
    Resolve
  </button>
</div>

{actionMessage && (
  <p className="status-action-message">{actionMessage}</p>
)}
    </div>
  </div>
)}

    </div>
  );
}

export default Alerts;