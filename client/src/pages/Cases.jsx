
import { useEffect, useState } from "react";
import { FileSearch, RefreshCw, Search } from "lucide-react";
import { getCases } from "../services/api";

function Cases({ onOpenCase }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCases() {
    try {
      setLoading(true);
      setError("");
      const data = await getCases();
      setCases(Array.isArray(data) ? data : data.cases || []);
    } catch (err) {
      setError(err.message || "Could not load cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  const filteredCases = cases.filter((item) =>
    `${item.title} ${item.description || ""} ${item.difficulty || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">CTF Case Studies</h1>
          <p className="page-subtitle">
            Investigate simulated security incidents and capture flags.
          </p>
        </div>
        <button className="secondary-button" onClick={loadCases}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="case-toolbar panel">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search case studies..."
          />
        </div>
        <span className="muted">
          {filteredCases.length} case(s)
        </span>
      </div>

      {loading && <div className="panel">Loading case studies...</div>}

      {error && (
        <div className="panel error-message">
          {error}
          <button className="secondary-button" onClick={loadCases}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filteredCases.length === 0 && (
        <div className="panel empty-state">
          <FileSearch size={30} />
          <h3>No cases found</h3>
          <p className="muted">Try a different search term.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="cases-grid">
          {filteredCases.map((item) => (
            <article className="case-card panel" key={item.id}>
              <div className="case-card-top">
                <span className="case-id">{item.id}</span>
                <span className={`difficulty ${String(item.difficulty || "beginner").toLowerCase()}`}>
                  {item.difficulty || "Beginner"}
                </span>
              </div>

              <div className="case-icon">
                <FileSearch size={22} />
              </div>

              <h3>{item.title}</h3>
              <p className="muted case-description">
                {item.description || "Review the evidence and investigate this simulated incident."}
              </p>

              <div className="case-card-footer">
                <span className="muted">
                  {item.category || "Blue Team Investigation"}
                </span>
                <button
                  className="primary-button"
                  onClick={() => onOpenCase(item.id)}
                >
                  Open Case
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cases;