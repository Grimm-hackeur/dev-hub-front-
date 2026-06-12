import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Star, MessageSquare, Play, ShoppingCart, Terminal, Globe, Code2, Hash, TrendingUp, Send, Zap } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Btn, Badge, Spinner, Card } from "../components/ui";

const ICONS = { MessageSquare, Send, Terminal, Globe, Code2, Hash, TrendingUp, Zap };

export default function ProjectDetail({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/community/reviews?project=${id}`),
    ]).then(([p, r]) => {
      setProject(p.data.project);
      setReviews(r.data.reviews || []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) { navigate("/auth"); return; }
    if (user.coins < project.price) { showToast("Coins insuffisants", "error"); return; }
    setBuying(true);
    try {
      await api.post(`/projects/${id}/purchase`);
      updateUser({ coins: user.coins - project.price });
      showToast("Achat réussi ! Licence disponible dans ton compte.");
      setProject(p => ({ ...p, accessCount: p.accessCount + 1 }));
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally { setBuying(false); }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner /></div>;
  if (!project) return <div style={{ padding: 20, color: "var(--text3)" }}>Projet introuvable</div>;

  const Icon = ICONS[project.icon] || Terminal;
  const alreadyOwned = user?.projects?.includes(id);

  return (
    <div style={{ padding: "14px 18px 80px" }}>
      <div onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text2)", cursor: "pointer", marginBottom: 18 }}>
        <ArrowLeft size={16} />Retour
      </div>

      {/* Header */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={26} color="var(--purple-light)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{project.name}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>{project.type}</div>
            <Badge variant={project.status === "active" ? "green" : project.status === "beta" ? "yellow" : "blue"}>
              {project.status === "active" ? "Actif" : project.status === "beta" ? "Beta" : "Bientôt"}
            </Badge>
          </div>
        </div>

        {/* Rating */}
        {reviews.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={14} fill={s <= Math.floor(avgRating) ? "var(--yellow)" : "transparent"} color={s <= Math.floor(avgRating) ? "var(--yellow)" : "var(--bg4)"} />
            ))}
            <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 4 }}>{avgRating}</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>({reviews.length} avis)</span>
          </div>
        )}

        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 14 }}>{project.description}</div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
          {project.tags?.map(t => (
            <span key={t} style={{ padding: "3px 9px", borderRadius: 6, fontSize: 10, background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text3)" }}>{t}</span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 0, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          {[{ n: project.views, l: "Vues" }, { n: project.accessCount, l: "Accès" }].map((s, i) => (
            <div key={s.l} style={{ flex: 1, textAlign: "center", borderRight: i === 0 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--purple-light)" }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
              <span style={{ fontSize: 13 }}>⬡</span>{project.price}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>Coins</div>
          </div>
        </div>
      </Card>

      {/* Stack */}
      {project.stack?.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 12 }}>Stack technique</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.stack.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, background: "var(--bg3)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text2)" }}>
                <Code2 size={10} />{s}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 9 }}>
        {alreadyOwned ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 13, borderRadius: 11, background: "var(--green-dim)", border: "1px solid var(--green-border)", color: "var(--green)", fontSize: 14, fontWeight: 600 }}>
            <CheckCircle size={16} />Déjà obtenu
          </div>
        ) : (
          <Btn style={{ flex: 1 }} onClick={handleBuy} disabled={buying || project.status === "soon"}>
            {buying ? "Achat en cours..." : <><ShoppingCart size={14} />Acheter — {project.price} coins</>}
          </Btn>
        )}
        {project.hasDemo && (
          <Btn variant="green" onClick={() => window.open(project.demoUrl, "_blank")}>
            <Play size={14} />Démo
          </Btn>
        )}
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Avis <span style={{ color: "var(--purple-light)" }}>({reviews.length})</span>
          </div>
          {reviews.slice(0, 3).map((r, i) => (
            <Card key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--purple-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "var(--purple-light)", fontFamily: "'Space Grotesk',sans-serif" }}>
                  {r.user?.pseudo?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.user?.pseudo}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= r.rating ? "var(--yellow)" : "transparent"} color={s <= r.rating ? "var(--yellow)" : "var(--bg4)"} />)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{r.text}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
