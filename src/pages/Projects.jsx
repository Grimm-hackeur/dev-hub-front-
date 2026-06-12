import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { Spinner } from "../components/ui";

const CATS = ["Tout", "Bot", "Tool", "Template", "Script"];

export default function Projects({ showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Tout");
  const [search, setSearch] = useState("");
  const [favs, setFavs] = useState({});
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    api.get("/projects").then(res => {
      setProjects(res.data.projects || []);
    }).finally(() => setLoading(false));
  }, []);

  const toggleFav = async (id) => {
    if (!user) { navigate("/auth"); return; }
    try {
      const res = await api.post(`/projects/${id}/favorite`);
      setFavs(f => ({ ...f, [id]: res.data.added }));
      showToast(res.data.added ? "Ajouté aux favoris !" : "Retiré des favoris");
    } catch { showToast("Erreur", "error"); }
  };

  const filtered = projects.filter(p => {
    const matchCat = cat === "Tout" || p.type === cat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchFav = !showFavs || favs[p._id];
    return matchCat && matchSearch && matchFav;
  });

  return (
    <div style={{ padding: "14px 18px 80px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Catalogue</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 14 }}>
          Tous les <span style={{ color: "var(--purple-light)" }}>projets</span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
          <input
            placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 13px 9px 32px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 12 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              flexShrink: 0, padding: "5px 13px", borderRadius: 100, fontSize: 11, fontWeight: 500,
              cursor: "pointer", border: cat === c ? "none" : "1px solid var(--border)",
              background: cat === c ? "var(--purple)" : "transparent",
              color: cat === c ? "#fff" : "var(--text3)", transition: "all .18s",
            }}>{c}</button>
          ))}
          <button onClick={() => setShowFavs(f => !f)} style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
            padding: "5px 13px", borderRadius: 100, fontSize: 11, fontWeight: 500, cursor: "pointer",
            border: showFavs ? "none" : "1px solid var(--border)",
            background: showFavs ? "var(--pink-dim)" : "transparent",
            color: showFavs ? "var(--pink)" : "var(--text3)",
            borderColor: showFavs ? "var(--pink-border)" : "var(--border)",
          }}>
            <Heart size={11} fill={showFavs ? "var(--pink)" : "transparent"} />Favoris
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)", fontSize: 13 }}>Aucun projet trouvé</div>
      ) : (
        filtered.map(p => (
          <ProjectCard key={p._id} project={p} isFav={!!favs[p._id]} onToggleFav={toggleFav} />
        ))
      )}
    </div>
  );
}
