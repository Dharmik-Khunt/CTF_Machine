
const API_BASE_URL = "http://localhost:5000/api";

export async function getDashboard(userId) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard?userId=${encodeURIComponent(userId)}`
  );
  if (!response.ok) throw new Error("Unable to load dashboard data.");
  return response.json();
}

export async function getCases() {
  const response = await fetch(`${API_BASE_URL}/cases`);
  if (!response.ok) throw new Error("Unable to load case studies.");
  return response.json();
}

export async function getAlerts() {
  const response = await fetch(`${API_BASE_URL}/alerts`);
  if (!response.ok) throw new Error("Unable to load alerts.");
  return response.json();
}

export async function getCaseProgress(caseId, userId) {
  const response = await fetch(
    `${API_BASE_URL}/investigation/${caseId}/progress?userId=${encodeURIComponent(userId)}`
  );
  if (!response.ok) throw new Error("Unable to load investigation progress.");
  return response.json();
}

export async function submitCaseAnswers(caseId, userId, answers) {
  const response = await fetch(
    `${API_BASE_URL}/investigation/${caseId}/submit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, answers }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Unable to submit answers.");
  }
  return data;
}

export async function requestCaseHint(caseId, userId) {
  const response = await fetch(
    `${API_BASE_URL}/investigation/${caseId}/hint`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Unable to request a hint.");
  }
  return data;
}