import { Link, useNavigate } from "react-router-dom";
import { Layers, Bell, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar({ unread = 0, banner, onCloseBanner }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const bannerColors = {
    purple: { bg: "var(--purple-dim)", border: "var(--purple-border)", color: "var(--purple-light)" },
    green:  { bg: "var(--green-dim)",  border: "var(--green-border)",  color: "var(--green)" },
    yellow: { bg: "var(--yellow-dim)", border: "var(--yellow-border)", color: "var(--yellow)" },
    blue:   { bg: "var(--blue-dim)",   border: "var(--blue-border)",   color: "var(--blue)" },
  };
  const bc = bannerColors[banner?.color] || bannerColors.purple;

  return (
    <>
      {/* BANNIÈRE GLOBALE */}
      {banner?.isActive && (
        <div style={{
          padding: "9px 18px", display: "flex", alignItems: "center", gap: 10,
          background: bc.bg, borderBottom: `1px solid ${bc.border}`, color: bc.color,
          fontSize: 12, fontWeight: 500, animation: "slideDown .3s ease",
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
        }}>
          <Bell size={13} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{banner.text}</span>
          <div onClick={onCloseBanner} style={{ cursor: "pointer", opacity: .7 }}>✕</div>
        </div>
      )}

      <nav style={{
        position: "fixed", top: banner?.isActive ? 38 : 0, left: 0, right: 0, zIndex: 50,
        height: 58, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px", background: "rgba(8,9,13,0.94)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)", transition: "top .3s ease",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700 }}>
            DEV<span style={{ color: "var(--purple-light)" }}>HUB</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user && (
            <Link to="/dashboard" style={{ position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)" }}>
                <Bell size={15} />
              </div>
              {unread > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "var(--purple)", color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg)" }}>
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <Link to="/dashboard">
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,var(--purple),#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", border: "2px solid var(--purple-border)", cursor: "pointer" }}>
                {user.pseudo?.[0]?.toUpperCase() || "U"}
              </div>
            </Link>
          ) : (
            <Link to="/auth">
              <button style={{ padding: "7px 16px", borderRadius: 9, background: "var(--purple)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Connexion
              </button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
