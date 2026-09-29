const alerts = [
  {
    id: "ALT-001",
    caseId: "case-01",
    timestamp: "2026-09-28T08:15:23Z",
    severity: "HIGH",
    status: "NEW",
    title: "Multiple Failed Login Attempts",
    description:
      "Multiple failed authentication attempts were detected against a simulated user account.",
    sourceIp: "10.20.30.45",
    destination: "AUTH-SERVER-01",
    username: "analyst-demo",
    eventType: "authentication_failure",
    mitreTechnique: "T1110",
    mitreName: "Brute Force",
  },

  {
    id: "ALT-002",
    caseId: "case-02",
    timestamp: "2026-09-28T09:42:11Z",
    severity: "CRITICAL",
    status: "NEW",
    title: "Suspicious PowerShell Activity",
    description:
      "A simulated endpoint generated an alert for suspicious PowerShell execution.",
    sourceIp: "10.20.40.22",
    destination: "ENDPOINT-07",
    username: "test-user",
    eventType: "process_execution",
    mitreTechnique: "T1059.001",
    mitreName: "PowerShell",
  },

  {
    id: "ALT-003",
    caseId: "case-03",
    timestamp: "2026-09-28T11:06:45Z",
    severity: "MEDIUM",
    status: "NEW",
    title: "Unusual Outbound Network Traffic",
    description:
      "A simulated workstation generated an unusual outbound traffic pattern.",
    sourceIp: "10.20.50.18",
    destination: "203.0.113.50",
    username: "demo-user",
    eventType: "network_connection",
    mitreTechnique: "T1071.001",
    mitreName: "Web Protocols",
  },

  {
    id: "ALT-004",
    caseId: "case-04",
    timestamp: "2026-09-28T13:27:09Z",
    severity: "HIGH",
    status: "NEW",
    title: "Suspicious File Modification",
    description:
      "Multiple files were modified unexpectedly on a simulated endpoint.",
    sourceIp: "10.20.60.31",
    destination: "FILE-SERVER-02",
    username: "service-demo",
    eventType: "file_modification",
    mitreTechnique: "T1486",
    mitreName: "Data Encrypted for Impact",
  },
];

function getAllAlerts() {
  return alerts;
}

function getAlertById(id) {
  return alerts.find((alert) => alert.id === id);
}

module.exports = {
  getAllAlerts,
  getAlertById,
};