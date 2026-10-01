
import React, { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import { RefreshCw, Printer, Download } from "lucide-react";

const USER_ID = "analyst-01";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDashboard(USER_ID);

      // Backend response: { success: true, dashboard: { summary, cases } }
      const dashboard = response?.dashboard;

      if (!dashboard) {
        throw new Error("Dashboard data was not found in the API response.");
      }

      setSummary(dashboard.summary || null);
      setCases(Array.isArray(dashboard.cases) ? dashboard.cases : []);
    } catch (err) {
      console.error("Report loading error:", err);
      setError(err.message || "Unable to load report data.");
      setSummary(null);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const completion =
    summary && summary.totalCases > 0
      ? Math.round(
          (summary.completedCases / summary.totalCases) * 100
        )
      : 0;

  const exportReport = () => {
    if (!summary) return;

    const lines = [
      "SOC DEFENSIVE CTF - ACTIVITY REPORT",
      "===================================",
      "",
      `Completion: ${completion}%`,
      `Completed: ${summary.completedCases} of ${summary.totalCases}`,
      `Remaining: ${summary.remainingCases}`,
      `Total Attempts: ${summary.totalAttempts}`,
      `Hints Used: ${summary.totalHints}`,
      `Flags Captured: ${summary.flagsCaptured}`,
      `Total Score: ${summary.totalScore}`,
      `Maximum Score: ${summary.maximumScore}`,
      "",
      "CASE PERFORMANCE",
      "----------------",
      ...cases.map(
        (item) =>
          `${item.title} | ${
            item.completed ? "Completed" : "Not completed"
          } | Score: ${item.score} | Attempts: ${item.attempts} | Hints: ${item.hintsUsed}`
      ),
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ctf-activity-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1 className="page-title">Reports</h1>
        <p className="muted">Loading your CTF activity...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">
            Review your defensive CTF activity and case outcomes.
          </p>
        </div>

        <div className="report-actions">
          <button className="secondary-button" onClick={loadReport}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            className="secondary-button"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print
          </button>
          <button
            className="primary-button"
            onClick={exportReport}
            disabled={!summary}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="panel">
          <p className="error-message">{error}</p>
          <button className="secondary-button" onClick={loadReport}>
            Try again
          </button>
        </div>
      )}

      {!error && summary && (
        <>
          <div className="report-summary-grid">
            <div className="report-metric">
              <span>Completion</span>
              <strong>{completion}%</strong>
              <small>
                {summary.completedCases} of {summary.totalCases} cases
              </small>
            </div>

            <div className="report-metric">
              <span>Total Attempts</span>
              <strong>{summary.totalAttempts}</strong>
            </div>

            <div className="report-metric">
              <span>Hints Used</span>
              <strong>{summary.totalHints}</strong>
            </div>

            <div className="report-metric">
              <span>Total Score</span>
              <strong>{summary.totalScore}</strong>
              <small>of {summary.maximumScore}</small>
            </div>
          </div>

          <section className="panel">
            <h2 className="panel-title">Overall Progress</h2>
            <p className="muted">
              {summary.completedCases} completed · {summary.remainingCases}{" "}
              remaining
            </p>
            <div className="report-progress-track">
              <div
                className="report-progress-fill"
                style={{ width: `${completion}%` }}
              />
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">Case Performance</h2>

            {cases.length === 0 ? (
              <p className="muted">No case data available.</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Case</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Attempts</th>
                      <th>Hints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          <span
                            className={`report-status ${
                              item.completed ? "completed" : "pending"
                            }`}
                          >
                            {item.completed ? "Completed" : "In progress"}
                          </span>
                        </td>
                        <td>{item.score}</td>
                        <td>{item.attempts}</td>
                        <td>{item.hintsUsed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}