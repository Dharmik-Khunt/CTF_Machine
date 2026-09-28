const caseService = require("../services/caseService");

// GET /api/cases
function getAllCases(req, res) {
  try {
    const cases = caseService.getAllCases();

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve case studies.",
    });
  }
}

// GET /api/cases/:id
function getCaseById(req, res) {
  try {
    const { id } = req.params;
    const caseData = caseService.getCaseById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case study not found.",
      });
    }

    res.status(200).json({
      success: true,
      case: caseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve case study.",
    });
  }
}

module.exports = {
  getAllCases,
  getCaseById,
};