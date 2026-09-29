const dashboardService = require("../services/dashboardService");

// GET /api/dashboard?userId=analyst-01
function getDashboard(req, res) {
  try {
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

    const dashboard = dashboardService.getDashboardData(
      userId.trim()
    );

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard data.",
    });
  }
}

module.exports = {
  getDashboard,
};