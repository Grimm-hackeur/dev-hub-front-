import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, ThumbsUp, Flag, Star, AlertTriangle, BadgeCheck, ExternalLink } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Btn, Card, Spinner } from "../components/ui";

export default function Community({ showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("channels");
  const [reviews, setReviews] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState({});
  const [newReview, setNewReview] = useState({ rating: 0, text: "", project: "" });
  const [hoverStar, setHoverStar] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [bugForm, setBugForm] = useState({ project: "", title: "", description: "", severity: "medium" });

  useEffect(() => {
    if (tab === "reviews") {
      setLoading(true);
      api.get("/community/reviews").then(r => setReviews(r.data.reviews || [])).finally(() => setLoading(false));
    }
    if (tab === "bugs") {
      setLoading(true);
      api.get("/community/bugs").then(r => setBugs(r.data.bugs || [])).finally(() => setLoading(false));
    }
  }, [tab]);

  const likeReview = async (id, i) => {
    if (!user) { navigate("/auth"); return; }
    try {
      await api.post(`/community/reviews/${id}/like`);
      setLiked(l => ({ ...l, [i]: !l[i] }));
    } catch { }
  };

  const submitReview = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!newReview.rating || !newReview.text || !newReview.project) { showToast("Remplis tous les champs.", "error"); return; }
    try {
      const r = await api.post("/community/reviews", newReview);
      setReviews(p => [r.data.review, ...p]);
      setNewReview({ rating: 0, text: "", project: "" });
      showToast("Avis publié ! +50 points");
    } catch (err) { showToast(err.response?.data?.message || "Erreur", "error"); }
  };

  const submitBug = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!bugForm.title || !bugForm.description || !bugForm.project) { showToast("Remplis tous les champs.", "error"); return; }
    try {
      await api.post("/community/bugs", bugForm);
      setReportOpen(false);
      showToast("Signalement envoyé ! +30 points");
    } catch { showToast("Erreur", "error"); }
  };

  const SEV_COLORS = { low: "var(--green)", medium: "var(--yellow)", high: "var(--orange)", critical: "var(--red)" };
  const SEV_LABELS = { low: "Faible", medium: "Modéré", high: "Critique", critical: "Urgent" };
  const STATUS_COLORS = { open: "var(--red)", in_progress: "var(--yellow)", resolved: "var(--green)", closed: "var(--text3)" };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Channels Hero */}
      <div style={{ padding: "22px 18px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(124,58,237,0.12),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          Rejoins la <span style={{ color: "var(--purple-light)" }}>communauté</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 20 }}>
          Suis nos canaux pour les mises à jour, nouveaux projets et annonces exclusives.
        </div>

        {/* WhatsApp */}
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "var(--r)", padding: 18, marginBottom: 12, cursor: "pointer", transition: "all .22s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.06)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageSquare size={22} color="var(--green)" />
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "var(--green)" }}>DevHub WhatsApp</div>
              <div style={{ fontSize: 11, color: "rgba(34,197,94,0.7)", fontFamily: "'JetBrains Mono',monospace" }}>@devhub_official</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(34,197,94,0.8)", lineHeight: 1.6, marginBottom: 14 }}>
            Nouvelles versions, bots actifs, promos exclusives et support direct. Rejoins +2 400 membres.
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {[{ n: "2.4K+", l: "Membres" }, { n: "Daily", l: "Updates" }, { n: "24/7", l: "Support" }].map(s => (
              <div key={s.l} style={{ fontSize: 11, color: "rgba(34,197,94,0.7)" }}><strong style={{ color: "var(--green)" }}>{s.n}</strong> {s.l}</div>
            ))}
          </div>
          <button onClick={() => showToast("Redirection WhatsApp...")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 700, width: "100%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "var(--green)", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
            <MessageSquare size={16} />Rejoindre le canal WhatsApp <ExternalLink size={13} />
          </button>
        </div>

        {/* Telegram */}
        <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "var(--r)", padding: 18, cursor: "pointer", transition: "all .22s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,0.1)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(56,189,248,0.06)"; e.currentTarget.style.borderColor = "rgba(56,189,248,0.2)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(56,189,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Send size={22} color="var(--blue)" />
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "var(--blue)" }}>DevHub Telegram</div>
              <div style={{ fontSize: 11, color: "rgba(56,189,248,0.7)", fontFamily: "'JetBrains Mono',monospace" }}>@devhub_tg</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(56,189,248,0.8)", lineHeight: 1.6, marginBottom: 14 }}>
            Annonces instantanées, changelogs détaillés et discussions techniques. 1 800+ membres.
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {[{ n: "1.8K+", l: "Membres" }, { n: "Instant", l: "Notifs" }, { n: "Free", l: "Accès" }].map(s => (
              <div key={s.l} style={{ fontSize: 11, color: "rgba(56,189,248,0.7)" }}><strong style={{ color: "var(--blue)" }}>{s.n}</strong> {s.l}</div>
            ))}
          </div>
          <button onClick={() => showToast("Redirection Telegram...")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 700, width: "100%", background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "var(--blue)", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
            <Send size={16} />Rejoindre le canal Telegram <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 18px 10px", overflowX: "auto", scrollbarWidth: "none" }}>
        {[{ id: "channels", l: "Canaux" }, { id: "reviews", l: "Avis" }, { id: "bugs", l: "Signalements" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 9, fontSize: 11, fontWeight: 500, cursor: "pointer", border: tab === t.id ? "none" : "1px solid var(--border)", background: tab === t.id ? "var(--purple-dim)" : "transparent", borderColor: tab === t.id ? "var(--purple-border)" : "var(--border)", color: tab === t.id ? "var(--purple-light)" : "var(--text3)", fontFamily: "'Inter',sans-serif" }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding: "0 18px" }}>
        {tab === "channels" && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text3)", fontSize: 12 }}>Rejoins un canal ci-dessus pour rester informé.</div>
        )}

        {/* REVIEWS */}
        {tab === "reviews" && (
          <>
            {/* Write review */}
            <div style={{ background: "var(--purple-dim)", border: "1px solid var(--purple-border)", borderRadius: "var(--r)", padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "var(--purple-light)", fontWeight: 500, marginBottom: 10 }}>Laisser un avis</div>
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={22} fill={s <= (hoverStar || newReview.rating) ? "var(--yellow)" : "transparent"} color={s <= (hoverStar || newReview.rating) ? "var(--yellow)" : "var(--bg4)"} style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setNewReview(r => ({ ...r, rating: s }))} />
                ))}
              </div>
              <input placeholder="ID du projet" value={newReview.project} onChange={e => setNewReview(r => ({ ...r, project: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12, outline: "none", marginBottom: 8 }} />
              <textarea placeholder="Partage ton expérience..." value={newReview.text} onChange={e => setNewReview(r => ({ ...r, text: e.target.value }))} rows={3}
                style={{ width: "100%", padding: "9px 12px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12, outline: "none", resize: "none", marginBottom: 10 }} />
              <Btn size="sm" onClick={submitReview}><Send size={12} />Publier l'avis</Btn>
            </div>

            {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
              : reviews.map((r, i) => (
                <Card key={r._id || i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--purple-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 700, color: "var(--purple-light)", flexShrink: 0 }}>
                      {r.user?.pseudo?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
                        {r.user?.pseudo}
                        {r.isVerified && <BadgeCheck size={13} color="var(--blue)" />}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>{new Date(r.createdAt).toLocaleDateString("fr")}</div>
                    </div>
                    <span style={{ padding: "2px 7px", borderRadius: 5, fontSize: 9, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", color: "var(--purple-light)" }}>
                      {r.project?.name || "—"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? "var(--yellow)" : "transparent"} color={s <= r.rating ? "var(--yellow)" : "var(--bg4)"} />)}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 10 }}>{r.text}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div onClick={() => likeReview(r._id, i)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: liked[i] ? "var(--purple-light)" : "var(--text3)", cursor: "pointer" }}>
                      <ThumbsUp size={12} />{r.likes?.length + (liked[i] ? 1 : 0)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text3)", cursor: "pointer", marginLeft: "auto" }}>
                      <Flag size={12} />
                    </div>
                  </div>
                </Card>
              ))
            }
          </>
        )}

        {/* BUGS */}
        {tab === "bugs" && (
          <>
            <Btn size="sm" style={{ marginBottom: 14 }} onClick={() => setReportOpen(true)}>
              <AlertTriangle size={12} />Signaler un bug
            </Btn>

            {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
              : bugs.map((b, i) => (
                <div key={b._id || i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 14, marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertTriangle size={15} color="var(--red)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5, marginBottom: 6 }}>{b.description}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ padding: "2px 7px", borderRadius: 100, fontSize: 9, fontWeight: 600, background: "var(--yellow-dim)", border: "1px solid var(--yellow-border)", color: SEV_COLORS[b.severity] || "var(--yellow)" }}>
                        {SEV_LABELS[b.severity] || b.severity}
                      </span>
                      <span style={{ fontSize: 10, color: STATUS_COLORS[b.status] || "var(--text3)", fontWeight: 600 }}>· {b.status === "open" ? "Ouvert" : b.status === "in_progress" ? "En cours" : "Résolu"}</span>
                      <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: "auto" }}>{b.project?.name}</span>
                    </div>
                  </div>
                </div>
              ))
            }
          </>
        )}
      </div>

      {/* Modal report bug */}
      {reportOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end" }} onClick={() => setReportOpen(false)}>
          <div style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px 20px 0 0", padding: "22px 20px 36px", animation: "slideUp .28s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border2)", margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Signaler un bug</div>
            {[
              { l: "ID du projet", k: "project", ph: "ID MongoDB du projet" },
              { l: "Titre du bug", k: "title", ph: "Résumé du problème" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>{f.l}</label>
                <input placeholder={f.ph} value={bugForm[f.k]} onChange={e => setBugForm(b => ({ ...b, [f.k]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Description</label>
              <textarea placeholder="Décris le bug et comment le reproduire..." value={bugForm.description} onChange={e => setBugForm(b => ({ ...b, description: e.target.value }))} rows={3}
                style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none", resize: "none" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Sévérité</label>
              <select value={bugForm.severity} onChange={e => setBugForm(b => ({ ...b, severity: e.target.value }))}
                style={{ appearance: "none", width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}>
                <option value="low">Faible</option>
                <option value="medium">Modéré</option>
                <option value="high">Critique</option>
                <option value="critical">Urgent</option>
              </select>
            </div>
            <Btn style={{ width: "100%" }} onClick={submitBug}><Send size={14} />Envoyer le signalement</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
