
const investigationService = require("../services/investigationService");

// POST /api/investigation/:caseId/submit
function submitAnswers(req, res) {
  try {
    const { caseId } = req.params;
    const { userId, answers } = req.body;

    if (
      typeof userId !== "string" ||
      !userId.trim() ||
      userId.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid userId is required.",
      });
    }

    const result = investigationService.submitAnswers(
      userId.trim(),
      caseId,
      answers
    );

    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to submit investigation answers.",
    });
  }
}

// GET /api/investigation/:caseId/progress?userId=analyst-01
function getProgress(req, res) {
  try {
    const { caseId } = req.params;
    const userId = req.query.userId;

    if (
      typeof userId !== "string" ||
      !userId.trim() ||
      userId.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid userId query parameter is required.",
      });
    }

    const result = investigationService.getCaseProgress(
      userId.trim(),
      caseId
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Case study not found.",
      });
    }

    return res.status(200).json({
      success: true,
      progress: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve investigation progress.",
    });
  }
}

// POST /api/investigation/:caseId/hint
function useHint(req, res) {
  try {
    const { caseId } = req.params;
    const { userId } = req.body;

    if (
      typeof userId !== "string" ||
      !userId.trim() ||
      userId.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid userId is required.",
      });
    }

    const result = investigationService.useHint(
      userId.trim(),
      caseId
    );

    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve a hint.",
    });
  }
}

module.exports = {
  submitAnswers,
  getProgress,
  useHint,
};