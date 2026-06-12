import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Crown, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Btn, Card, Spinner } from "../components/ui";

function Countdown({ endsAt }) {
  const calc = () => {
    const diff = Math.max(0, new Date(endsAt) - Date.now());
    return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
  };
  const [t, setT] = useState(calc());
  useEffect(() => { const i = setInterval(() => setT(calc()), 1000); return () => clearInterval(i); }, [endsAt]);
  const pad = n => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[{ n: pad(t.h), l: "Heures" }, { n: pad(t.m), l: "Min" }, { n: pad(t.s), l: "Sec" }].map(b => (
        <div key={b.l} style={{ flex: 1, background: "rgba(0,0,0,.3)", borderRadius: 8, padding: "6px 0", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--orange)" }}>{b.n}</div>
          <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px" }}>{b.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function Events({ showToast }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    api.get("/events").then(r => setEvents(r.data.events || [])).finally(() => setLoading(false));
  }, []);

  const join = async (ev) => {
    if (!user) { navigate("/auth"); return; }
    setJoining(ev._id);
    try {
      const res = await api.post(`/events/${ev._id}/join`);
      showToast("Participation confirmée !");
      if (res.data.coins !== undefined) updateUser({ coins: res.data.coins });
      setEvents(e => e.map(x => x._id === ev._id ? { ...x, usedSlots: (x.usedSlots || 0) + 1, participants: [...(x.participants || []), user._id] } : x));
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally { setJoining(null); }
  };

  return (
    <div style={{ padding: "14px 18px 80px" }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Offres limitées</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Événements <span style={{ color: "var(--purple-light)" }}>actifs</span>
      </div>

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
        : events.length === 0
          ? <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 13 }}>Aucun événement actif pour le moment</div>
          : events.map(ev => {
            const isFlash = ev.type === "flash";
            const hasJoined = ev.participants?.includes(user?._id);
            const isFull = ev.type === "limited" && ev.usedSlots >= ev.maxSlots;

            return (
              <div key={ev._id} style={{
                borderRadius: "var(--r)", padding: 16, marginBottom: 12,
                background: isFlash ? "var(--orange-dim)" : "var(--purple-dim)",
                border: `1px solid ${isFlash ? "var(--orange-border)" : "var(--purple-border)"}`,
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, marginBottom: 10, background: isFlash ? "rgba(251,146,60,.15)" : "var(--purple-dim)", border: `1px solid ${isFlash ? "var(--orange-border)" : "var(--purple-border)"}`, color: isFlash ? "var(--orange)" : "var(--purple-light)" }}>
                  {isFlash ? <Zap size={10} /> : <Crown size={10} />}
                  {isFlash ? "FLASH DEAL" : "LIMITÉ"}
                </div>

                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                  {ev.title || `${ev.project?.name} ${isFlash ? `à ${ev.promoPrice} coins` : "gratuit"}`}
                </div>

                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12, lineHeight: 1.6 }}>
                  {isFlash
                    ? `${ev.promoPrice} coins au lieu de ${ev.originalPrice}. Profites-en avant la fin !`
                    : `Seulement ${ev.maxSlots - (ev.usedSlots || 0)} places restantes sur ${ev.maxSlots}.`
                  }
                </div>

                {isFlash && ev.endsAt && <div style={{ marginBottom: 14 }}><Countdown endsAt={ev.endsAt} /></div>}

                {!isFlash && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text2)", marginBottom: 4 }}>
                      <span>Places</span><span style={{ color: "var(--purple-light)", fontWeight: 600 }}>{ev.usedSlots || 0}/{ev.maxSlots}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "var(--bg4)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${((ev.usedSlots || 0) / ev.maxSlots) * 100}%`, background: "var(--purple)", borderRadius: 3 }} />
                    </div>
                  </div>
                )}

                {hasJoined ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 10, background: "var(--green-dim)", border: "1px solid var(--green-border)", color: "var(--green)", fontSize: 13, fontWeight: 600 }}>
                    <CheckCircle size={15} />Participation confirmée
                  </div>
                ) : (
                  <Btn style={{ width: "100%" }} onClick={() => join(ev)} disabled={!!joining || isFull} variant={isFlash ? "purple" : "purple"}>
                    {joining === ev._id ? "En cours..." : isFull ? "Complet" : isFlash ? `Acheter — ${ev.promoPrice} coins` : "Réserver ma place gratuite"}
                  </Btn>
                )}
              </div>
            );
          })
      }
    </div>
  );
}
