const fs = require("fs");
const path = require("path");

const caseService = require("./caseService");

const progressFile = path.join(
  __dirname,
  "../data/progress.json"
);

// Read progress from JSON file
function loadProgress() {
  try {
    if (!fs.existsSync(progressFile)) {
      fs.writeFileSync(
        progressFile,
        JSON.stringify({ users: {} }, null, 2)
      );
    }

    const data = fs.readFileSync(progressFile, "utf8");

    return JSON.parse(data);
  } catch (error) {
    console.error("Unable to load progress:", error);

    return {
      users: {},
    };
  }
}

// Save progress to JSON file
function saveProgress(progress) {
  try {
    fs.writeFileSync(
      progressFile,
      JSON.stringify(progress, null, 2)
    );
  } catch (error) {
    console.error("Unable to save progress:", error);

    throw error;
  }
}

function createDefaultProgress() {
  return {
    attempts: 0,
    hintsUsed: 0,
    completed: false,
    score: 0,
  };
}

function getUserCaseProgress(progress, userId, caseId) {
  if (!progress.users[userId]) {
    progress.users[userId] = {};
  }

  if (!progress.users[userId][caseId]) {
    progress.users[userId][caseId] = createDefaultProgress();
  }

  return progress.users[userId][caseId];
}

// Submit investigation answers
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

  const progress = loadProgress();

  const userProgress = getUserCaseProgress(
    progress,
    userId,
    caseId
  );

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

    saveProgress(progress);

    return {
      success: true,
      completed: true,
      results,
      score,
      flag: caseData.flag,
      message: "All answers are correct. Flag unlocked!",
    };
  }

  saveProgress(progress);

  return {
    success: true,
    completed: false,
    results,
    message:
      "Some answers are incorrect. Review the evidence and try again.",
  };
}

// Get progress for one case
function getCaseProgress(userId, caseId) {
  const caseData = caseService.getPrivateCaseById(caseId);

  if (!caseData) {
    return null;
  }

  const progress = loadProgress();

  return getUserCaseProgress(
    progress,
    userId,
    caseId
  );
}

// Use a hint
function useHint(userId, caseId) {
  const caseData = caseService.getPrivateCaseById(caseId);

  if (!caseData) {
    return {
      success: false,
      status: 404,
      message: "Case study not found.",
    };
  }

  const progress = loadProgress();

  const userProgress = getUserCaseProgress(
    progress,
    userId,
    caseId
  );

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

  saveProgress(progress);

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