const caseService = require("./caseService");

function getDashboardData(userId) {
  const cases = caseService.getAllCases();

  let completedCases = 0;
  let totalAttempts = 0;
  let totalHints = 0;
  let totalScore = 0;
  let flagsCaptured = 0;

  const caseProgress = cases.map((caseData) => {
    const progress = getProgressForCase(userId, caseData.id);

    totalAttempts += progress.attempts;
    totalHints += progress.hintsUsed;

    if (progress.completed) {
      completedCases += 1;
      flagsCaptured += 1;
      totalScore += progress.score;
    }

    return {
      id: caseData.id,
      title: caseData.title,
      difficulty: caseData.difficulty,
      completed: progress.completed,
      score: progress.score,
      attempts: progress.attempts,
      hintsUsed: progress.hintsUsed,
    };
  });

  const totalCases = cases.length;

  return {
    userId,
    summary: {
      totalCases,
      completedCases,
      remainingCases: totalCases - completedCases,
      totalAttempts,
      totalHints,
      flagsCaptured,
      totalScore,
      maximumScore: totalCases * 100,
    },
    cases: caseProgress,
  };
}

function getProgressForCase(userId, caseId) {
  const investigationService = require("./investigationService");

  return (
    investigationService.getCaseProgress(userId, caseId) || {
      attempts: 0,
      hintsUsed: 0,
      completed: false,
      score: 0,
    }
  );
}

module.exports = {
  getDashboardData,
};