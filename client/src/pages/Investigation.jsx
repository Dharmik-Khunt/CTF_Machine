
import { useEffect, useState } from "react";
import {
  ArrowLeft, FileText, ShieldAlert, Send, Lightbulb,
  CheckCircle, Lock, RefreshCw
} from "lucide-react";
import {
  getCases, getCaseProgress, submitCaseAnswers, requestCaseHint
} from "../services/api";

const USER_ID = "analyst-01";

function Investigation({ caseId, onBack }) {
  const [caseData, setCaseData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [caseResponse, progressResponse] = await Promise.all([
        getCases(),
        getCaseProgress(caseId, USER_ID),
      ]);

      const list = Array.isArray(caseResponse)
        ? caseResponse
        : caseResponse.cases || [];
      const selected = list.find((item) => item.id === caseId);

      if (!selected) throw new Error("Case not found.");

      const questions = selected.questions || [];
      setCaseData(selected);
      setAnswers(questions.map(() => ""));
      setProgress(progressResponse.progress || progressResponse);
    } catch (err) {
      setError(err.message || "Could not load this investigation.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (caseId) loadData();
  }, [caseId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!caseData || progress?.completed) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await submitCaseAnswers(
        caseId,
        USER_ID,
        answers
      );
      setResult(response);
      await loadProgressOnly();
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function loadProgressOnly() {
    const response = await getCaseProgress(caseId, USER_ID);
    setProgress(response.progress || response);
  }

  async function handleHint() {
    try {
      setHintLoading(true);
      setError("");
      const response = await requestCaseHint(caseId, USER_ID);
      setHint(response.hint || response.message || "No hint was returned.");
      await loadProgressOnly();
    } catch (err) {
      setError(err.message || "Could not retrieve hint.");
    } finally {
      setHintLoading(false);
    }
  }

  if (loading) return <div className="panel">Loading investigation...</div>;

  if (error && !caseData) {
    return (
      <div className="panel error-message">
        {error}
        <button className="secondary-button" onClick={onBack}>
          Back to Cases
        </button>
      </div>
    );
  }

  if (!caseData) return null;

  const questions = caseData.questions || [];
  const evidence = caseData.evidence || [];
  const logs = caseData.logs || [];
  const completed = Boolean(progress?.completed);

  return (
    <div className="investigation-page">
      <div className="page-heading-row">
        <div>
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Cases
          </button>
          <h1 className="page-title">{caseData.title}</h1>
          <p className="page-subtitle">
            {caseData.id} · {caseData.difficulty || "Beginner"}
          </p>
        </div>
        <span className="lab-status">
          <ShieldAlert size={15} /> SIMULATED INCIDENT
        </span>
      </div>

      <section className="panel investigation-summary">
        <h2>Incident Overview</h2>
        <p>{caseData.description || "Review the evidence and investigate this incident."}</p>
      </section>

      <div className="investigation-columns">
        <section className="panel">
          <h2><FileText size={18} /> Evidence</h2>
          {evidence.length === 0 && (
            <p className="muted">No evidence items are available.</p>
          )}
          {evidence.map((item, index) => (
            <div className="evidence-item" key={item.id || index}>
              <strong>{item.title || item.name || `Evidence ${index + 1}`}</strong>
              <p>{item.description || item.content || JSON.stringify(item)}</p>
            </div>
          ))}
        </section>

        <section className="panel">
          <h2>Investigation Questions</h2>
          {questions.length === 0 ? (
            <p className="muted">No questions are available.</p>
          ) : (
            <form onSubmit={handleSubmit} className="answer-form">
              {questions.map((question, index) => (
                <label className="answer-field" key={question.id || index}>
                  <span>
                    {index + 1}.{" "}
                    {typeof question === "string"
                      ? question
                      : question.question || question.text}
                  </span>
                  <input
                    value={answers[index] || ""}
                    disabled={completed || submitting}
                    onChange={(event) => {
                      const updated = [...answers];
                      updated[index] = event.target.value;
                      setAnswers(updated);
                    }}
                    placeholder="Enter your answer..."
                  />
                </label>
              ))}

              {error && <p className="error-text">{error}</p>}

              {result && (
                <div className={`submission-result ${result.correct ? "result-success" : "result-error"}`}>
                  {result.correct
                    ? "All answers are correct. Case completed!"
                    : result.message || "Some answers are incorrect. Review the evidence and try again."}
                </div>
              )}

              <button
                className="primary-button submit-answer-button"
                type="submit"
                disabled={completed || submitting}
              >
                <Send size={15} />
                {submitting ? "Checking..." : completed ? "Case Completed" : "Submit Answers"}
              </button>
            </form>
          )}
        </section>
      </div>

      <section className="panel hint-panel">
        <div>
          <h2><Lightbulb size={18} /> Need a Hint?</h2>
          <p className="muted">Hints can help you find the relevant evidence.</p>
          {hint && <div className="hint-message">{hint}</div>}
        </div>
        <button
          className="secondary-button"
          onClick={handleHint}
          disabled={hintLoading || completed}
        >
          <Lightbulb size={15} />
          {hintLoading ? "Loading..." : "Get Hint"}
        </button>
      </section>

      <section className="panel progress-panel">
        <h2>Case Progress</h2>
        <div className="progress-stats">
          <span>Attempts: <strong>{progress?.attempts ?? 0}</strong></span>
          <span>Hints used: <strong>{progress?.hintsUsed ?? 0}</strong></span>
          <span>Score: <strong>{progress?.score ?? 0}</strong></span>
        </div>

        {completed ? (
          <div className="flag-unlocked">
            <CheckCircle size={20} />
            <div>
              <strong>Flag unlocked</strong>
              <p>Your case has been marked as completed.</p>
              <code>{result?.flag || "Check the response for your captured flag."}</code>
            </div>
          </div>
        ) : (
          <div className="locked-message">
            <Lock size={16} /> Solve all questions to unlock the flag.
          </div>
        )}

        <button className="secondary-button" onClick={loadData}>
          <RefreshCw size={15} /> Refresh Progress
        </button>
      </section>

      <section className="panel">
        <h2>Simulated Event Logs</h2>
        {logs.length === 0 ? (
          <p className="muted">No log records are available.</p>
        ) : (
          <div className="log-list">
            {logs.map((log, index) => (
              <pre className="log-entry" key={log.id || index}>
                {typeof log === "string" ? log : JSON.stringify(log, null, 2)}
              </pre>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Investigation;