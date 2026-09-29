
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  FolderOpen,
  Flag,
  Activity,
  RefreshCw,
} from "lucide-react";
import { getDashboard } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const result = await getDashboard("analyst-01");
      setData(result.dashboard);
    } catch (err) {
      setError(err.message || "Dashboard could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const summary = data?.summary;

  const stats = [
    {
      label: "Total Case Studies",
      value: summary?.totalCases ?? "—",
      icon: FolderOpen,
      color: "blue",
    },
    {
      label: "Cases Completed",
      value: summary?.completedCases ?? "—",
      icon: ShieldCheck,
      color: "green",
    },
    {
      label: "Flags Captured",
      value: summary?.flagsCaptured ?? "—",
      icon: Flag,
      color: "purple",
    },
    {
      label: "Total Attempts",
      value: summary?.totalAttempts ?? "—",
      icon: Activity,
      color: "orange",
    },
  ];

  return (
    <div className="page-content">
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">Security Overview</h1>
          <p className="page-subtitle">
            Monitor your blue team training progress and
            investigate simulated security incidents.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="panel loading-panel">
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="error-panel">
          <strong>Unable to load dashboard</strong>
          <p>{error}</p>
          <p>
            Check that your backend is running on port 5000.
          </p>
          <button onClick={loadDashboard}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-card-top">
                    <span>{stat.label}</span>
                    <div className={`stat-icon ${stat.color}`}>
                      <Icon size={19} />
                    </div>
                  </div>
                  <div className="stat-value">
                    {stat.value}
                  </div>
                  <div className="stat-footnote">
                    Simulated training environment
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dashboard-columns">
            <section className="panel">
              <h3 className="panel-title">
                Case Study Progress
              </h3>

              <div className="progress-summary">
                <div>
                  <span className="muted">Completed</span>
                  <strong>
                    {summary?.completedCases ?? 0} /{" "}
                    {summary?.totalCases ?? 0}
                  </strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        summary?.totalCases
                          ? (summary.completedCases /
                              summary.totalCases) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="case-progress-list">
                {data?.cases?.map((item) => (
                  <div className="case-progress-row" key={item.id}>
                    <div className="case-progress-info">
                      <div className="case-progress-name">
                        {item.title}
                      </div>
                      <div className="case-progress-id">
                        {item.id} · {item.difficulty || "Training"}
                      </div>
                    </div>

                    <div className="case-progress-result">
                      <span
                        className={
                          item.completed
                            ? "status-complete"
                            : "status-pending"
                        }
                      >
                        {item.completed
                          ? "Completed"
                          : "Pending"}
                      </span>
                      <strong>{item.score} pts</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel score-panel">
              <h3 className="panel-title">Training Score</h3>

              <div className="score-number">
                {summary?.totalScore ?? 0}
                <span>
                  {" "}
                  / {summary?.maximumScore ?? 0}
                </span>
              </div>

              <p className="muted">
                Points earned across completed cases.
              </p>

              <div className="score-divider" />

              <div className="score-detail">
                <span>Hints used</span>
                <strong>{summary?.totalHints ?? 0}</strong>
              </div>

              <div className="score-detail">
                <span>Cases remaining</span>
                <strong>
                  {summary?.remainingCases ?? 0}
                </strong>
              </div>

              <div className="score-detail">
                <span>Flags captured</span>
                <strong>
                  {summary?.flagsCaptured ?? 0}
                </strong>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}