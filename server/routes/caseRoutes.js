const express = require("express");
const router = express.Router();

const caseController = require("../controllers/caseController");

// Get all case studies
router.get("/", caseController.getAllCases);

// Get one case study by ID
router.get("/:id", caseController.getCaseById);

module.exports = router;