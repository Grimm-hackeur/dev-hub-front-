import { useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Zap, Trophy, User, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { path: "/",           label: "Home",      Icon: Home },
  { path: "/projects",   label: "Projets",   Icon: LayoutGrid },
  { path: "/events",     label: "Events",    Icon: Zap },
  { path: "/leaderboard",label: "Classement",Icon: Trophy },
  { path: "/dashboard",  label: "Compte",    Icon: User },
];

export default function BottomNav({ unread = 0 }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(8,9,13,.96)", backdropFilter: "blur(20px)",
      borderTop: "1px solid var(--border)", display: "flex", height: 62,
    }}>
      {NAV.map(({ path, label, Icon }) => {
        const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return (
          <div key={path} onClick={() => navigate(path)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 3, cursor: "pointer",
              color: active ? "var(--purple-light)" : "var(--text3)",
              fontSize: 9, fontWeight: 500, letterSpacing: ".3px",
              textTransform: "uppercase", transition: "color .18s",
              position: "relative",
            }}>
            {label === "Compte" && unread > 0 && (
              <span style={{ position: "absolute", top: 7, right: "calc(50% - 14px)", minWidth: 14, height: 14, borderRadius: 7, background: "var(--purple)", color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: "2px solid var(--bg)" }}>
                {unread}
              </span>
            )}
            <Icon size={20} />
            {label}
          </div>
        );
      })}
    </nav>
  );
}
