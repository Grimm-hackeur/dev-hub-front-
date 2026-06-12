import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Zap, Crown, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { Btn, Card, Spinner } from "../components/ui";

export default function Home({ showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState({});
  const [time, setTime] = useState({ h: 2, m: 34, s: 17 });

  useEffect(() => {
    Promise.all([
      api.get("/projects?limit=4"),
      api.get("/events"),
    ]).then(([p, e]) => {
      setProjects(p.data.projects?.slice(0, 4) || []);
      setEvents(e.data.events || []);
    }).finally(() => setLoading(false));
  }, []);

  // Countdown
  useEffect(() => {
    const i = setInterval(() => setTime(t => {
      if (t.s > 0) return { ...t, s: t.s - 1 };
      if (t.m > 0) return { ...t, m: t.m - 1, s: 59 };
      if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
      return t;
    }), 1000);
    return () => clearInterval(i);
  }, []);

  const toggleFav = async (id) => {
    if (!user) { navigate("/auth"); return; }
    try {
      const res = await api.post(`/projects/${id}/favorite`);
      setFavs(f => ({ ...f, [id]: res.data.added }));
      showToast(res.data.added ? "Ajouté aux favoris !" : "Retiré des favoris");
    } catch { showToast("Erreur", "error"); }
  };

  const pad = n => String(n).padStart(2, "0");
  const flashEvent = events.find(e => e.type === "flash");
  const limitedEvent = events.find(e => e.type === "limited");

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* HERO */}
      <div style={{ padding: "52px 18px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 400, height: 250, background: "radial-gradient(ellipse,rgba(124,58,237,0.15),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", color: "var(--purple-light)", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 18 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", animation: "blink 2s infinite" }} />
          Premium Tech Platform
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(30px,7vw,46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.5px", marginBottom: 12 }}>
          Bots, Tools &<br /><span style={{ color: "var(--purple-light)" }}>Templates prêts</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, maxWidth: 380, marginBottom: 22 }}>
          Des projets complets, testés et documentés. Déployables immédiatement sur ton serveur.
        </p>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <Btn onClick={() => navigate("/projects")}>Explorer les projets <ArrowRight size={13} /></Btn>
          <Btn variant="ghost" onClick={() => navigate("/events")}>Voir les événements</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          {[
            { n: projects.length || "8+", l: "Projets" },
            { n: "1250+", l: "Utilisateurs" },
            { n: "24/7", l: "Support" },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--purple-light)" }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 18px" }}>
        {/* FLASH DEAL */}
        {flashEvent && (
          <div style={{ background: "var(--orange-dim)", border: "1px solid var(--orange-border)", borderRadius: "var(--r)", padding: 16, marginBottom: 16, cursor: "pointer" }} onClick={() => navigate("/events")}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: "rgba(251,146,60,.15)", border: "1px solid var(--orange-border)", color: "var(--orange)", fontSize: 10, fontWeight: 700, marginBottom: 10 }}>
              <Zap size={10} />FLASH DEAL ACTIF
            </div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{flashEvent.project?.name} à prix réduit !</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>
              {flashEvent.promoPrice} coins au lieu de {flashEvent.originalPrice}. Expire dans :
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ n: pad(time.h), l: "Heures" }, { n: pad(time.m), l: "Min" }, { n: pad(time.s), l: "Sec" }].map(b => (
                <div key={b.l} style={{ flex: 1, background: "rgba(0,0,0,.3)", borderRadius: 8, padding: "6px 0", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--orange)" }}>{b.n}</div>
                  <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px" }}>{b.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJETS */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 700 }}>
            Projets <span style={{ color: "var(--purple-light)" }}>en vedette</span>
          </div>
          <div onClick={() => navigate("/projects")} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--text3)", cursor: "pointer" }}>
            Tout voir <ChevronRight size={13} />
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
        ) : (
          projects.slice(0, 3).map(p => (
            <ProjectCard key={p._id} project={p} isFav={!!favs[p._id]} onToggleFav={toggleFav} />
          ))
        )}

        {/* EVENT LIMITÉ */}
        {limitedEvent && (
          <div style={{ background: "var(--purple-dim)", border: "1px solid var(--purple-border)", borderRadius: "var(--r)", padding: 16, marginTop: 6, cursor: "pointer" }} onClick={() => navigate("/events")}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", color: "var(--purple-light)", fontSize: 10, fontWeight: 700, marginBottom: 10 }}>
              <Crown size={10} />LIMITÉ
            </div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{limitedEvent.title}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>
              {limitedEvent.maxSlots - limitedEvent.usedSlots} places restantes sur {limitedEvent.maxSlots}
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "var(--bg4)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(limitedEvent.usedSlots / limitedEvent.maxSlots) * 100}%`, background: "var(--purple)", borderRadius: 3 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
