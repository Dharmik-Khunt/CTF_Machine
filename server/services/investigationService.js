
const caseService = require("./caseService");

// Store demo progress in memory for now.
// This resets when the backend restarts.
const progress = {};

function getProgressKey(userId, caseId) {
  return `${userId}:${caseId}`;
}

function submitAnswers(userId, caseId, answers) {
  const caseData = caseService.getPrivateCaseById(caseId);

  if (!caseData) {
    return {
      success: false,
      status: 404,
      message: "Case study not found.",
    };
  }

  if (!Array.isArray(answers)) {
    return {
      success: false,
      status: 400,
      message: "Answers must be an array.",
    };
  }

  const key = getProgressKey(userId, caseId);

  if (!progress[key]) {
    progress[key] = {
      attempts: 0,
      hintsUsed: 0,
      completed: false,
      score: 0,
    };
  }

  const userProgress = progress[key];

  if (userProgress.completed) {
    return {
      success: true,
      completed: true,
      message: "This case is already completed.",
      score: userProgress.score,
      flag: caseData.flag,
    };
  }

  if (answers.length !== caseData.answerKey.length) {
    return {
      success: false,
      status: 400,
      message: `Submit exactly ${caseData.answerKey.length} answers.`,
    };
  }

  userProgress.attempts += 1;

  const results = answers.map((answer, index) => {
    const expected = String(caseData.answerKey[index])
      .trim()
      .toLowerCase();

    const submitted = String(answer ?? "")
      .trim()
      .toLowerCase();

    return submitted === expected;
  });

  const allCorrect = results.every(Boolean);

  if (allCorrect) {
    const score = Math.max(
      0,
      100 - userProgress.hintsUsed * 10
    );

    userProgress.completed = true;
    userProgress.score = score;

    return {
      success: true,
      completed: true,
      results,
      score,
      flag: caseData.flag,
      message: "All answers are correct. Flag unlocked!",
    };
  }

  return {
    success: true,
    completed: false,
    results,
    message: "Some answers are incorrect. Review the evidence and try again.",
  };
}

function getCaseProgress(userId, caseId) {
  const caseData = caseService.getPrivateCaseById(caseId);

  if (!caseData) {
    return null;
  }

  const key = getProgressKey(userId, caseId);

  return progress[key] || {
    attempts: 0,
    hintsUsed: 0,
    completed: false,
    score: 0,
  };
}

function useHint(userId, caseId) {
  const caseData = caseService.getPrivateCaseById(caseId);

  if (!caseData) {
    return {
      success: false,
      status: 404,
      message: "Case study not found.",
    };
  }

  const key = getProgressKey(userId, caseId);

  if (!progress[key]) {
    progress[key] = {
      attempts: 0,
      hintsUsed: 0,
      completed: false,
      score: 0,
    };
  }

  const userProgress = progress[key];

  if (userProgress.completed) {
    return {
      success: false,
      status: 400,
      message: "This case is already completed.",
    };
  }

  if (userProgress.hintsUsed >= 2) {
    return {
      success: false,
      status: 400,
      message: "No more hints are available.",
    };
  }

  userProgress.hintsUsed += 1;

  return {
    success: true,
    hint: caseData.hint,
    hintsUsed: userProgress.hintsUsed,
  };
}

module.exports = {
  submitAnswers,
  getCaseProgress,
  useHint,
};