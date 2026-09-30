const alertsData = require("../data/alerts");

function getAllAlerts() {
  return alertsData.getAllAlerts();
}

function getAlertById(id) {
  return alertsData.getAlertById(id) || null;
}

function getAlertsByCaseId(caseId) {
  return getAllAlerts().filter(
    (alert) => alert.caseId === caseId || alert.case_id === caseId
  );
}

function updateAlertStatus(id, status) {
  const alert = getAlertById(id);

  if (!alert) {
    return null;
  }

  const normalizedStatus = {
    new: "NEW",
    acknowledged: "ACKNOWLEDGED",
    resolved: "RESOLVED",
  }[String(status).toLowerCase()];

  if (!normalizedStatus) {
    return null;
  }

  alert.status = normalizedStatus;
  alert.updatedAt = new Date().toISOString();

  return alert;
}

module.exports = {
  getAllAlerts,
  getAlertById,
  getAlertsByCaseId,
  updateAlertStatus,
};