
import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import {
  getDashboard,
  getAlerts,
} from "../services/api";

function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReportData();
  }, []);

  async function loadReportData() {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, alertsResponse] =
        await Promise.all([
          getDashboard(),
          getAlerts(),
        ]);

      console.log(
        "Dashboard report response:",
        dashboardResponse
      );

      console.log(
        "Alerts report response:",
        alertsResponse
      );

      // Dashboard
      if (dashboardResponse?.dashboard) {
        setDashboard(dashboardResponse.dashboard);
      } else {
        setDashboard(dashboardResponse);
      }

      // Alerts
      if (Array.isArray(alertsResponse)) {
        setAlerts(alertsResponse);
      } else if (Array.isArray(alertsResponse?.alerts)) {
        setAlerts(alertsResponse.alerts);
      } else {
        setAlerts([]);
      }

    } catch (err) {
      console.error(
        "Failed to load report data:",
        err
      );

      setError(
        "Unable to load incident report data."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    const report = {
      reportType: "SOC Defensive CTF Incident Report",
      generatedAt: new Date().toISOString(),

      dashboard: dashboard,

      alerts: alerts,

      summary: {
        totalAlerts: alerts.length,

        criticalAlerts: alerts.filter(
          (alert) =>
            String(alert.severity || "").toLowerCase() ===
            "critical"
        ).length,

        highAlerts: alerts.filter(
          (alert) =>
            String(alert.severity || "").toLowerCase() ===
            "high"
        ).length,

        mediumAlerts: alerts.filter(
          (alert) =>
            String(alert.severity || "").toLowerCase() ===
            "medium"
        ).length,

        lowAlerts: alerts.filter(
          (alert) =>
            String(alert.severity || "").toLowerCase() ===
            "low"
        ).length,

        resolvedAlerts: alerts.filter(
          (alert) =>
            String(alert.status || "").toLowerCase() ===
            "resolved"
        ).length,
      },
    };

    const jsonData = JSON.stringify(
      report,
      null,
      2
    );

    const blob = new Blob(
      [jsonData],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `soc-incident-report-${Date.now()}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) =>
      String(alert.severity || "").toLowerCase() ===
      "critical"
  ).length;

  const highAlerts = alerts.filter(
    (alert) =>
      String(alert.severity || "").toLowerCase() ===
      "high"
  ).length;

  const resolvedAlerts = alerts.filter(
    (alert) =>
      String(alert.status || "").toLowerCase() ===
      "resolved"
  ).length;

  if (loading) {
    return (
      <div className="panel">
        <h2>Incident Reports</h2>

        <p className="muted">
          Loading incident report data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel">
        <h2>Incident Reports</h2>

        <div className="error-message">
          {error}
        </div>

        <button
          className="primary-button"
          onClick={loadReportData}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="page-heading">

        <div>
          <h2>Incident Reports</h2>

          <p className="muted">
            Review the security activity and investigation
            results from the SOC CTF lab.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={downloadReport}
        >
          <Download size={17} />
          Download Report
        </button>

      </div>

      {/* REPORT SUMMARY */}
      <div className="alert-summary">

        <div className="summary-card">
          <span>Total Alerts</span>
          <strong>{totalAlerts}</strong>
        </div>

        <div className="summary-card">
          <span>Critical</span>
          <strong>{criticalAlerts}</strong>
        </div>

        <div className="summary-card">
          <span>High</span>
          <strong>{highAlerts}</strong>
        </div>

        <div className="summary-card">
          <span>Resolved</span>
          <strong>{resolvedAlerts}</strong>
        </div>

      </div>

      {/* INCIDENT OVERVIEW */}
      <div className="panel">

        <div className="section-heading">

          <div>
            <FileText size={20} />

            <div>
              <h3>Incident Overview</h3>

              <p className="muted">
                Summary of the simulated SOC environment.
              </p>
            </div>
          </div>

        </div>

        {dashboard ? (
          <div className="report-grid">

            <div className="report-item">
              <span>Cases</span>

              <strong>
                {dashboard.totalCases ??
                  dashboard.cases ??
                  dashboard.caseCount ??
                  0}
              </strong>
            </div>

            <div className="report-item">
              <span>Completed Cases</span>

              <strong>
                {dashboard.completedCases ??
                  dashboard.completed ??
                  0}
              </strong>
            </div>

            <div className="report-item">
              <span>Total Score</span>

              <strong>
                {dashboard.totalScore ??
                  dashboard.score ??
                  0}
              </strong>
            </div>

            <div className="report-item">
              <span>Alerts</span>

              <strong>{totalAlerts}</strong>
            </div>

          </div>
        ) : (
          <p className="muted">
            No dashboard data available.
          </p>
        )}

      </div>

      {/* ALERT BREAKDOWN */}
      <div className="panel">

        <div className="section-heading">

          <div>
            <AlertTriangle size={20} />

            <div>
              <h3>Alert Breakdown</h3>

              <p className="muted">
                Current simulated security detections.
              </p>
            </div>
          </div>

        </div>

        {alerts.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={32} />

            <h3>No security alerts</h3>

            <p className="muted">
              No alerts are currently available.
            </p>
          </div>
        ) : (
          <div className="table-container">

            <table className="alerts-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>SEVERITY</th>
                  <th>TITLE</th>
                  <th>SOURCE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {alerts.map((alert) => (

                  <tr key={alert.id}>

                    <td>
                      <strong>
                        {alert.id || "N/A"}
                      </strong>
                    </td>

                    <td>
                      {alert.severity || "Info"}
                    </td>

                    <td>
                      {alert.title ||
                        alert.name ||
                        "Security Detection"}
                    </td>

                    <td>
                      {alert.source ||
                        alert.sourceIp ||
                        "Unknown"}
                    </td>

                    <td>
                      {String(
                        alert.status || "New"
                      ).toLowerCase() ===
                      "resolved" ? (
                        <span className="report-status resolved">
                          <CheckCircle size={14} />
                          Resolved
                        </span>
                      ) : (
                        <span className="report-status">
                          {alert.status || "New"}
                        </span>
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* REPORT INFORMATION */}
      <div className="panel">

        <h3>Report Information</h3>

        <div className="report-info">

          <p>
            <strong>Environment:</strong>{" "}
            SOC Defensive CTF Training Lab
          </p>

          <p>
            <strong>Report Type:</strong>{" "}
            Simulated Incident Report
          </p>

          <p>
            <strong>Data Source:</strong>{" "}
            Local CTF simulation backend
          </p>

          <p>
            <strong>Generated:</strong>{" "}
            {new Date().toLocaleString()}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Reports;
