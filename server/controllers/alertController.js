
const alertService = require("../services/alertService");

function getAllAlerts(req, res) {
  try {
    res.status(200).json(alertService.getAllAlerts());
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve alerts." });
  }
}

function getAlertById(req, res) {
  try {
    const alert = alertService.getAlertById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve alert." });
  }
}

function getAlertsByCaseId(req, res) {
  try {
    res.status(200).json(
      alertService.getAlertsByCaseId(req.params.caseId)
    );
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve case alerts." });
  }
}

function updateAlertStatus(req, res) {
  try {
    const allowedStatuses = ["New", "Acknowledged", "Resolved"];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be New, Acknowledged, or Resolved.",
      });
    }

    const alert = alertService.updateAlertStatus(
      req.params.id,
      status
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    res.status(200).json({
      message: "Alert status updated.",
      alert,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to update alert status." });
  }
}

module.exports = {
  getAllAlerts,
  getAlertById,
  getAlertsByCaseId,
  updateAlertStatus,
};