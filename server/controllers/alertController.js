const alertService = require("../services/alertService");

// GET /api/alerts
function getAllAlerts(req, res) {
  try {
    const alerts = alertService.getAllAlerts();

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Alert retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve alerts.",
    });
  }
}

// GET /api/alerts/:id
function getAlertById(req, res) {
  try {
    const { id } = req.params;

    const alert = alertService.getAlertById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error("Alert retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve alert.",
    });
  }
}

// GET /api/alerts/case/:caseId
function getAlertsByCaseId(req, res) {
  try {
    const { caseId } = req.params;

    const alerts = alertService.getAlertsByCaseId(caseId);

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Case alert retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve case alerts.",
    });
  }
}

module.exports = {
  getAllAlerts,
  getAlertById,
  getAlertsByCaseId,
};