import { useState, useEffect } from "react";
import { GitBranch, Clock } from "lucide-react";
import api from "../api/axios";
import { Card, Spinner } from "../components/ui";

const TYPE_STYLES = {
  major: { label: "MAJEUR", color: "var(--purple-light)", border: "var(--purple-border)", bg: "var(--purple-dim)", barColor: "var(--purple)" },
  minor: { label: "MINEUR", color: "var(--blue)",         border: "var(--blue-border)",   bg: "var(--blue-dim)",   barColor: "var(--blue)" },
  patch: { label: "PATCH",  color: "var(--green)",        border: "var(--green-border)",  bg: "var(--green-dim)", barColor: "var(--green)" },
};

const CHANGE_COLORS = {
  add:   "var(--green)",
  fix:   "var(--blue)",
  imp:   "var(--purple-light)",
  break: "var(--red)",
};
const CHANGE_LABELS = { add: "Ajout", fix: "Fix", imp: "Amélio.", break: "Break" };

export default function Changelog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/changelog").then(r => setLogs(r.data.changelog || [])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? logs : logs.filter(l => l.type === filter);

  return (
    <div style={{ padding: "14px 18px 80px" }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Historique</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        <span style={{ color: "var(--purple-light)" }}>Changelog</span>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}>
        {["all", "major", "minor", "patch"].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            flexShrink: 0, padding: "5px 13px", borderRadius: 100, fontSize: 11, fontWeight: 500, cursor: "pointer",
            border: filter === t ? "none" : "1px solid var(--border)",
            background: filter === t ? "var(--purple)" : "transparent",
            color: filter === t ? "#fff" : "var(--text3)", transition: "all .18s",
          }}>
            {t === "all" ? "Tout" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 13 }}>Aucun changelog disponible</div>
      ) : (
        filtered.map((log, i) => {
          const ts = TYPE_STYLES[log.type] || TYPE_STYLES.patch;
          return (
            <div key={log._id || i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 16, marginBottom: 10, position: "relative", overflow: "hidden" }}>
              {/* Barre colorée gauche */}
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 2, background: ts.barColor }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingLeft: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 600 }}>{log.version}</span>
                <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 9, fontWeight: 700, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color }}>{ts.label}</span>
                <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 9, fontWeight: 600, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", color: "var(--purple-light)" }}>{log.project?.name || "—"}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text3)", display: "flex", alignItems: "center", gap: 3 }}>
                  <Clock size={9} />{new Date(log.createdAt).toLocaleDateString("fr")}
                </span>
              </div>

              <div style={{ paddingLeft: 8 }}>
                {log.changes?.map((c, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: CHANGE_COLORS[c.type] || "var(--text3)", flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: CHANGE_COLORS[c.type] || "var(--text3)", minWidth: 46, flexShrink: 0 }}>{CHANGE_LABELS[c.type] || c.type}</span>
                    {c.text}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
