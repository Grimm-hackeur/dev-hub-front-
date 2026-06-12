import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/ui";

export default function Leaderboard() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [by, setBy] = useState("points");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/leaderboard?by=${by}&limit=20`).then(r => setBoard(r.data.leaderboard || [])).finally(() => setLoading(false));
  }, [by]);

  const top3 = board.slice(0, 3);
  const rest = board.slice(3);
  const rankColors = { 0: "var(--yellow)", 1: "var(--text2)", 2: "var(--orange)" };
  const podiumOrder = [1, 0, 2]; // silver, gold, bronze

  return (
    <div style={{ padding: "14px 18px 80px" }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Compétition</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        <span style={{ color: "var(--purple-light)" }}>Classement</span>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[{ v: "points", l: "Points" }, { v: "coins", l: "Coins" }].map(o => (
          <button key={o.v} onClick={() => setBy(o.v)} style={{
            padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 500,
            cursor: "pointer", border: by === o.v ? "none" : "1px solid var(--border)",
            background: by === o.v ? "var(--purple)" : "transparent",
            color: by === o.v ? "#fff" : "var(--text3)", transition: "all .18s",
          }}>{o.l}</button>
        ))}
      </div>

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div> : (
        <>
          {/* PODIUM */}
          {top3.length >= 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {podiumOrder.map((idx) => {
                const u = top3[idx];
                if (!u) return <div key={idx} />;
                const rank = idx + 1;
                const emoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
                const isMe = u.pseudo === user?.pseudo;
                return (
                  <div key={u._id} style={{
                    background: rank === 1 ? "linear-gradient(135deg,rgba(250,204,21,0.08),rgba(250,204,21,0.02))" : "var(--bg2)",
                    border: `1px solid ${rank === 1 ? "var(--yellow-border)" : "var(--border)"}`,
                    borderRadius: "var(--r-sm)", padding: 14, textAlign: "center",
                  }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{emoji}</div>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--purple-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--purple-light)", margin: "0 auto 8px" }}>
                      {u.pseudo?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{u.pseudo}{isMe && " 👈"}</div>
                    <div style={{ fontSize: 10, color: rankColors[idx], fontWeight: 600 }}>{u[by]} {by}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* REST */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "0 14px" }}>
            {rest.map((u, i) => {
              const rank = i + 4;
              const isMe = u.pseudo === user?.pseudo;
              return (
                <div key={u._id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 0", borderBottom: i < rest.length - 1 ? "1px solid var(--border)" : "none",
                  background: isMe ? "rgba(124,58,237,0.04)" : "transparent",
                }}>
                  <div style={{ width: 20, fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--text3)", textAlign: "center", flexShrink: 0 }}>{rank}</div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 700, color: "var(--text2)", flexShrink: 0 }}>
                    {u.pseudo?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>
                    {u.pseudo}{isMe && <span style={{ fontSize: 9, marginLeft: 6, color: "var(--purple-light)", fontWeight: 600 }}>● Toi</span>}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--purple-light)", flexShrink: 0 }}>{u[by]}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
