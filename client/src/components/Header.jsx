
import { Bell, CircleUserRound, ChevronDown } from "lucide-react";

export default function Header({ title }) {
  return (
    <header className="top-header">
      <div className="header-page-name">
        <span className="header-eyebrow">SECURITY OPERATIONS</span>
        <h2>{title}</h2>
      </div>

      <div className="header-actions">
        <div className="environment-badge">
          <span className="environment-dot" />
          LAB MODE
        </div>

        <button className="header-icon-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-user">
          <div className="user-avatar">
            <CircleUserRound size={19} />
          </div>
          <div className="user-details">
            <strong>Analyst 01</strong>
            <span>Blue Team</span>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}