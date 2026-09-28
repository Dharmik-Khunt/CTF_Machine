
const express = require("express");
const router = express.Router();

const investigationController = require(
  "../controllers/investigationController"
);

// Submit answers
router.post(
  "/:caseId/submit",
  investigationController.submitAnswers
);

// Get progress
router.get(
  "/:caseId/progress",
  investigationController.getProgress
);

// Request a hint
router.post(
  "/:caseId/hint",
  investigationController.useHint
);

module.exports = router;