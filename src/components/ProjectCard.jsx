import { useNavigate } from "react-router-dom";
import { Heart, Play, ArrowRight, Sparkles, MessageSquare, Send, Terminal, Globe, Code2, Hash, TrendingUp, Activity, Zap, Bot, Wrench } from "lucide-react";
import { Btn, Badge } from "./ui";

const ICONS = { MessageSquare, Send, Terminal, Globe, Code2, Hash, TrendingUp, Activity, Zap, Bot, Wrench };
const ICON_COLORS = { Bot: "#4ade80", Tool: "#a78bfa", Template: "#c084fc", Script: "#38bdf8" };
const ICON_BGS   = { Bot: "#064e3b", Tool: "#1a1a2e", Template: "#1a0a2e", Script: "#0c2a4a" };

export default function ProjectCard({ project, isFav, onToggleFav, onBuy }) {
  const navigate = useNavigate();
  const Icon = ICONS[project.icon] || Terminal;
  const iconBg = ICON_BGS[project.type] || "#1a1a2e";
  const iconColor = ICON_COLORS[project.type] || "#a78bfa";

  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)",
      padding: 15, marginBottom: 10, cursor: "pointer", transition: "all .22s", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple-border)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* Top */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={iconColor} />
        </div>
        <div style={{ flex: 1 }} onClick={() => navigate(`/projects/${project._id}`)}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{project.name}</div>
          <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px" }}>{project.type}</div>
          {project.isUpdated && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 4, fontSize: 8, fontWeight: 700, background: "var(--orange-dim)", border: "1px solid var(--orange-border)", color: "var(--orange)", marginTop: 3 }}>
              <Sparkles size={7} />MIS À JOUR
            </div>
          )}
        </div>
        {/* Fav */}
        <div onClick={() => onToggleFav?.(project._id)} style={{
          width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
          background: isFav ? "var(--pink-dim)" : "var(--bg3)",
          border: `1px solid ${isFav ? "var(--pink-border)" : "var(--border)"}`,
          cursor: "pointer", transition: "all .18s", flexShrink: 0,
        }}>
          <Heart size={13} fill={isFav ? "var(--pink)" : "transparent"} color={isFav ? "var(--pink)" : "var(--text3)"} />
        </div>
      </div>

      {/* Desc */}
      <div onClick={() => navigate(`/projects/${project._id}`)} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 10 }}>
        {project.description?.substring(0, 90)}{project.description?.length > 90 ? "..." : ""}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {project.tags?.slice(0, 4).map(t => (
          <span key={t} style={{ padding: "2px 7px", borderRadius: 5, fontSize: 9, fontWeight: 500, background: "var(--bg4)", border: "1px solid var(--border)", color: "var(--text3)" }}>{t}</span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--yellow)", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11 }}>⬡</span>{project.price} coins
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {project.hasDemo && (
            <Btn variant="green" size="xs" onClick={() => window.open(project.demoUrl, "_blank")}>
              <Play size={10} />Démo
            </Btn>
          )}
          <Btn variant="purple" size="xs" onClick={() => onBuy ? onBuy(project) : navigate(`/projects/${project._id}`)}>
            Obtenir <ArrowRight size={11} />
          </Btn>
        </div>
      </div>
    </div>
  );
}
