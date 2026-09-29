const alertData = require("../data/alerts");

function getAllAlerts() {
  return alertData.getAllAlerts();
}

function getAlertById(id) {
  return alertData.getAlertById(id);
}

function getAlertsByCaseId(caseId) {
  const alerts = alertData.getAllAlerts();

  return alerts.filter((alert) => alert.caseId === caseId);
}

module.exports = {
  getAllAlerts,
  getAlertById,
  getAlertsByCaseId,
};