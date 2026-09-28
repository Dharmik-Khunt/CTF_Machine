const cases = require("../data/cases");

// Remove private information before returning a case.
function sanitizeCase(caseData) {
  const {
    answerKey,
    flag,
    hint,
    ...publicCase
  } = caseData;

  return publicCase;
}

// Return all cases without their private answers or flags.
function getAllCases() {
  return cases.map((caseData) => {
    return sanitizeCase(caseData);
  });
}

// Return one case by ID.
function getCaseById(id) {
  const caseData = cases.find((item) => item.id === id);

  if (!caseData) {
    return null;
  }

  return sanitizeCase(caseData);
}

// Get the private case data for backend use only.
function getPrivateCaseById(id) {
  return cases.find((item) => item.id === id) || null;
}

module.exports = {
  getAllCases,
  getCaseById,
  getPrivateCaseById,
};