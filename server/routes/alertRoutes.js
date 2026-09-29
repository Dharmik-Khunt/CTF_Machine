const express = require("express");
const router = express.Router();

const alertController = require("../controllers/alertController");

// Get all alerts
router.get("/", alertController.getAllAlerts);

// Get alerts belonging to a specific case
router.get(
  "/case/:caseId",
  alertController.getAlertsByCaseId
);

// Get one alert
router.get("/:id", alertController.getAlertById);

module.exports = router;