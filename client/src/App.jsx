
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Investigation from "./pages/Investigation";
import Alerts from "./pages/Alerts";
import Flags from "./pages/Flags";
import "./App.css";

const pageTitles = {
  dashboard: "Dashboard",
  cases: "Case Studies",
  alerts: "Security Alerts",
  investigation: "Investigation",
  reports: "Reports",
  flags: "Captured Flags",
  settings: "Settings",
};

function PlaceholderPage({ title }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <p className="muted">
        This section will be developed in the next steps.
      </p>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState("");

  function openCase(caseId) {
    setSelectedCaseId(caseId);
    setActivePage("investigation");
  }
  function investigateAlert(alert) {
  const relatedCaseId = alert.caseId || alert.case_id;

  if (relatedCaseId) {
    openCase(relatedCaseId);
  } else {
    setActivePage("alerts");
  }
}

  function renderPage() {
    if (activePage === "dashboard") {
      return <Dashboard />;
    }

    if (activePage === "cases") {
      return <Cases onOpenCase={openCase} />;
    }

    if (activePage === "investigation") {
  return (
    <Investigation
      caseId={selectedCaseId}
      onBack={() => setActivePage("cases")}
    />
  );
}
if (activePage === "alerts") {
  return <Alerts onInvestigate={investigateAlert} />;
}
if (activePage === "flags") {
  return <Flags />;
}

    return <PlaceholderPage title={pageTitles[activePage] || "Page"} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <main className="main-area">
        <Header title={pageTitles[activePage] || "SOC CTF"} />
        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;