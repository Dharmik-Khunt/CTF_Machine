
const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");

router.get("/", alertController.getAllAlerts);
router.get("/case/:caseId", alertController.getAlertsByCaseId);
router.patch("/:id/status", alertController.updateAlertStatus);
router.get("/:id", alertController.getAlertById);

module.exports = router;