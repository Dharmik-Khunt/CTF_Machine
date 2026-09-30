
import { useEffect, useState } from "react";
import { Flag, RefreshCw, Lock, CheckCircle } from "lucide-react";
import { getDashboard } from "../services/api";

const USER_ID = "analyst-01";

function Flags() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFlags() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboard(USER_ID);

      // The backend wraps the dashboard inside { success, dashboard }.
      const dashboardData =
        data?.dashboard || data?.data?.dashboard || data;

      setDashboard(dashboardData);
    } catch (err) {
      setError(err.message || "Unable to load captured flags.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlags();
  }, []);

  if (loading) {
    return <div className="panel">Loading captured flags...</div>;
  }

  if (error) {
    return (
      <div className="panel error-message">
        {error}
        <button className="secondary-button" onClick={loadFlags}>
          Try again
        </button>
      </div>
    );
  }

  const cases = Array.isArray(dashboard?.cases)
    ? dashboard.cases
    : [];

  const summary = dashboard?.summary || {};
  const completed = cases.filter((item) => item.completed);
  const pending = cases.filter((item) => !item.completed);

  const flagsCaptured = summary.flagsCaptured ?? completed.length;
  const totalCases = summary.totalCases ?? cases.length;

  return (
    <div>
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">Captured Flags</h1>
          <p className="page-subtitle">
            Your progress through the defensive CTF challenges.
          </p>
        </div>

        <button className="secondary-button" onClick={loadFlags}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="flag-overview panel">
        <div className="flag-overview-icon">
          <Flag size={25} />
        </div>

        <div>
          <span className="muted">Flags Captured</span>
          <h2>
            {flagsCaptured} <span>/ {totalCases}</span>
          </h2>
          <p className="muted">
            Complete a case to unlock its flag.
          </p>
        </div>
      </div>

      <h2 className="section-heading">Completed Challenges</h2>

      {completed.length === 0 ? (
        <div className="panel empty-state">
          <Lock size={28} />
          <h3>No flags captured yet</h3>
          <p className="muted">
            Investigate a case and submit all correct answers to unlock a flag.
          </p>
        </div>
      ) : (
        <div className="flags-grid">
          {completed.map((item) => (
            <div className="panel flag-card" key={item.id}>
              <CheckCircle size={22} />
              <div>
                <span className="muted">{item.id}</span>
                <h3>{item.title}</h3>
                <span className="flag-captured-label">
                  Flag Unlocked
                </span>
                <p>Score: {item.score ?? 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-heading">Challenges Remaining</h2>

      {pending.length === 0 ? (
        <div className="panel">
          <p className="muted">
            All available challenges are completed.
          </p>
        </div>
      ) : (
        <div className="panel pending-flags">
          {pending.map((item) => (
            <div className="pending-flag-row" key={item.id}>
              <Lock size={17} />
              <span>{item.title}</span>
              <span className="muted">Locked</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Flags;