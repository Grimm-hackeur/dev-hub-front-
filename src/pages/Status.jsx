import { useState, useEffect } from "react";
import { Activity, RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import api from "../api/axios";
import { Card, Spinner } from "../components/ui";

export default function Status({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const load = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const r = await api.get("/projects");
      setProjects(r.data.projects || []);
      setLastUpdate(new Date());
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const allOnline  = projects.every(p => p.uptimeStatus === "online");
  const hasDeg     = projects.some(p => p.uptimeStatus === "degraded");
  const hasOffline = projects.some(p => p.uptimeStatus === "offline");

  const globalStatus = allOnline ? "ok" : hasDeg ? "degraded" : "offline";
  const globalColors = {
    ok:       { bg: "var(--green-dim)",  border: "var(--green-border)",  color: "var(--green)",  label: "Tous les systèmes opérationnels" },
    degraded: { bg: "var(--yellow-dim)", border: "var(--yellow-border)", color: "var(--yellow)", label: "Perturbations mineures" },
    offline:  { bg: "var(--red-dim)",    border: "var(--red-border)",    color: "var(--red)",    label: "Incident en cours" },
  };
  const gc = globalColors[globalStatus];

  const historyBlocks = (uptime) => Array.from({ length: 30 }, (_, i) => {
    if (i > 27) return uptime < 99 ? "degraded" : "ok";
    return "ok";
  });

  return (
    <div style={{ padding: "14px 18px 80px" }}>
      {/* Global */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: gc.bg, border: `1px solid ${gc.border}`, color: gc.color, fontSize: 13, fontWeight: 600 }}>
          {globalStatus === "ok"
            ? <CheckCircle size={16} />
            : <AlertTriangle size={16} />
          }
          {gc.label}
        </div>
      </div>

      {/* Refresh */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "var(--text3)", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={10} />Mis à jour à {lastUpdate.toLocaleTimeString("fr")}
        </div>
        <button onClick={() => load(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
          <RefreshCw size={12} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
          Actualiser
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
      ) : (
        <>
          {projects.map((p, i) => {
            const blocks = historyBlocks(p.uptime);
            return (
              <div key={p._id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple-border)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Activity size={18} color="var(--purple-light)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>{p.type}</div>
                  {/* History */}
                  <div style={{ display: "flex", gap: 2 }}>
                    {blocks.map((h, j) => (
                      <div key={j} style={{ flex: 1, height: 6, borderRadius: 2, background: h === "ok" ? "var(--green)" : h === "degraded" ? "var(--yellow)" : "var(--red)", opacity: h === "ok" ? .4 : 1 }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600,
                    background: p.uptimeStatus === "online" ? "var(--green-dim)" : p.uptimeStatus === "degraded" ? "var(--yellow-dim)" : "var(--red-dim)",
                    border: `1px solid ${p.uptimeStatus === "online" ? "var(--green-border)" : p.uptimeStatus === "degraded" ? "var(--yellow-border)" : "var(--red-border)"}`,
                    color: p.uptimeStatus === "online" ? "var(--green)" : p.uptimeStatus === "degraded" ? "var(--yellow)" : "var(--red)",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", animation: p.uptimeStatus === "online" ? "ping 1.5s infinite" : "none" }} />
                    {p.uptimeStatus === "online" ? "Online" : p.uptimeStatus === "degraded" ? "Dégradé" : "Offline"}
                  </div>
                  {p.uptime > 0 && <div style={{ fontSize: 10, color: "var(--text3)" }}>{p.uptime}%</div>}
                </div>
              </div>
            );
          })}

          {/* Légende */}
          <Card style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", marginBottom: 10 }}>Légende historique (30 jours)</div>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { color: "var(--green)",  label: "Opérationnel" },
                { color: "var(--yellow)", label: "Dégradé" },
                { color: "var(--red)",    label: "Hors ligne" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" }}>
                  <div style={{ width: 10, height: 6, borderRadius: 2, background: l.color }} />{l.label}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
