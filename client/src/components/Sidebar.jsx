
import {
  LayoutDashboard,
  ShieldAlert,
  FileSearch,
  Search,
  ClipboardList,
  Flag,
  Settings,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "cases", label: "Case Studies", icon: FileSearch },
  { id: "alerts", label: "Security Alerts", icon: ShieldAlert },
  { id: "investigation", label: "Investigation", icon: Search },
  { id: "reports", label: "Incident Reports", icon: ClipboardList },
  { id: "flags", label: "Flags & Progress", icon: Flag },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ShieldCheck size={23} />
        </div>
        <div>
          <div className="brand-title">SOC DEFENSE</div>
          <div className="brand-subtitle">CTF TRAINING LAB</div>
        </div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-dot" />
        <div>
          <div className="status-title">Lab Environment</div>
          <div className="status-subtitle">Simulation Active</div>
        </div>
      </div>
    </aside>
  );
}