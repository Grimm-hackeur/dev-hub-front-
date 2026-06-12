import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Package, Heart, Award, Users, Key, Clock, Copy, Check, Bell, Crown, Star, Flag, UserPlus, Activity, Zap, Share2, CheckCircle, Gift } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Btn, Card, Badge, Spinner, Divider } from "../components/ui";

const TABS = [
  { id: "overview",  label: "Profil" },
  { id: "licenses",  label: "Licences" },
  { id: "points",    label: "Points" },
  { id: "coins",     label: "Coins" },
  { id: "badges",    label: "Badges" },
  { id: "referral",  label: "Parrainage" },
  { id: "notifs",    label: "Notifs" },
];

const BADGES_INFO = {
  first_access:    { name: "Premier Accès",    color: "var(--yellow)",       bg: "var(--yellow-dim)",  border: "var(--yellow-border)",  Icon: Zap },
  beta_tester:     { name: "Beta Testeur",      color: "var(--blue)",         bg: "var(--blue-dim)",    border: "var(--blue-border)",    Icon: Activity },
  top_contributor: { name: "Top Contributeur",  color: "var(--purple-light)", bg: "var(--purple-dim)", border: "var(--purple-border)",  Icon: Star },
  referral_elite:  { name: "Parrain Elite",     color: "var(--orange)",       bg: "var(--orange-dim)", border: "var(--orange-border)",  Icon: Crown },
  faithful:        { name: "Fidèle",            color: "var(--red)",          bg: "var(--red-dim)",    border: "var(--red-border)",     Icon: Flag },
  legend:          { name: "Légende",           color: "var(--pink)",         bg: "var(--pink-dim)",   border: "var(--pink-border)",    Icon: Crown },
};

export default function Dashboard({ showToast }) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [licenses, setLicenses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    loadTab(tab);
  }, [tab, user]);

  const loadTab = async (t) => {
    setLoading(true);
    try {
      if (t === "licenses") {
        const res = await api.get("/projects/user/licenses");
        setLicenses(res.data.licenses || []);
      } else if (t === "coins") {
        const res = await api.get("/users/transactions");
        setTransactions(res.data.transactions || []);
      } else if (t === "notifs") {
        const res = await api.get("/notifications");
        setNotifs(res.data.notifications || []);
        setUnread(res.data.unread || 0);
      }
    } catch { } finally { setLoading(false); }
  };

  const copyKey = (key) => {
    navigator.clipboard?.writeText(key).catch(() => { });
    setCopied(key);
    showToast("Clé copiée !");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyRef = () => {
    const link = `${window.location.origin}/auth?ref=${user?.referralCode}`;
    navigator.clipboard?.writeText(link).catch(() => { });
    showToast("Lien copié !");
  };

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    setNotifs(n => n.map(x => ({ ...x, isRead: true })));
    setUnread(0);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (!user) return null;

  const level = user.level || 1;
  const LEVEL_THRESH = [0, 200, 500, 1000, 2000, 5000, 10000];
  const xpCurr = user.points || 0;
  const xpNext = LEVEL_THRESH[level] || 10000;
  const xpPrev = LEVEL_THRESH[level - 1] || 0;
  const xpPct = Math.min(100, Math.round(((xpCurr - xpPrev) / (xpNext - xpPrev)) * 100));

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* COVER + AVATAR */}
      <div style={{ height: 100, background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.15))", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%,rgba(124,58,237,0.3),transparent 60%)" }} />
      </div>
      <div style={{ padding: "0 18px", marginTop: -26, marginBottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: "linear-gradient(135deg,var(--purple),#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", border: "3px solid var(--bg)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
          {user.pseudo?.[0]?.toUpperCase()}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <Btn variant="ghost" size="sm">Modifier</Btn>
          <Btn variant="ghost" size="sm" onClick={handleLogout}><LogOut size={12} /></Btn>
        </div>
      </div>

      <div style={{ padding: "0 18px" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{user.pseudo}</div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10, fontFamily: "'JetBrains Mono',monospace" }}>{user.email}</div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {user.badges?.slice(0, 3).map(b => {
            const info = BADGES_INFO[b];
            if (!info) return null;
            return (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: info.bg, border: `1px solid ${info.border}`, color: info.color }}>
                <info.Icon size={9} />{info.name}
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", color: "var(--purple-light)" }}>
            <Crown size={9} />Niveau {level}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { n: user.projects?.length || 0, l: "Projets", c: "var(--purple-light)" },
            { n: user.points || 0,           l: "Points",  c: "var(--green)" },
            { n: user.coins || 0,            l: "Coins",   c: "var(--yellow)" },
          ].map(s => (
            <div key={s.l} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: s.c }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 6, padding: "0 18px 10px", overflowX: "auto", scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flexShrink: 0, padding: "6px 13px", borderRadius: 9, fontSize: 11, fontWeight: 500,
            cursor: "pointer", border: tab === t.id ? "none" : "1px solid var(--border)",
            background: tab === t.id ? "var(--purple-dim)" : "transparent",
            borderColor: tab === t.id ? "var(--purple-border)" : "var(--border)",
            color: tab === t.id ? "var(--purple-light)" : "var(--text3)", transition: "all .18s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "0 18px" }}>
        {loading && <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><Spinner /></div>}

        {/* OVERVIEW */}
        {tab === "overview" && !loading && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { Icon: Package, bg: "var(--purple-dim)", c: "var(--purple-light)", n: user.projects?.length || 0, l: "Projets obtenus" },
                { Icon: Heart,   bg: "var(--pink-dim)",   c: "var(--pink)",         n: user.favorites?.length || 0, l: "Favoris" },
                { Icon: Award,   bg: "var(--yellow-dim)", c: "var(--yellow)",       n: user.badges?.length || 0,    l: "Badges gagnés" },
                { Icon: Users,   bg: "var(--green-dim)",  c: "var(--green)",        n: user.referrals?.length || 0, l: "Filleuls" },
              ].map((d, i) => (
                <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: 14, cursor: "pointer" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: d.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><d.Icon size={16} color={d.c} /></div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: d.c, marginBottom: 2 }}>{d.n}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{d.l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LICENSES */}
        {tab === "licenses" && !loading && (
          <>
            {licenses.length === 0
              ? <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text3)", fontSize: 13 }}>Aucune licence pour le moment</div>
              : licenses.map((l, i) => (
                <Card key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--purple-dim)", border: "1px solid var(--purple-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={16} color="var(--purple-light)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" }}>{l.project?.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)", display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                        <Clock size={9} />Expire {l.expiresAt ? new Date(l.expiresAt).toLocaleDateString("fr") : "Jamais"}
                      </div>
                    </div>
                    <Badge variant="green" style={{ marginLeft: "auto" }}>Actif</Badge>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px" }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--purple-light)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.key}</span>
                    <div onClick={() => copyKey(l.key)} style={{ cursor: "pointer", color: "var(--text3)", flexShrink: 0 }}>
                      {copied === l.key ? <Check size={13} color="var(--green)" /> : <Copy size={13} />}
                    </div>
                  </div>
                </Card>
              ))
            }
          </>
        )}

        {/* POINTS */}
        {tab === "points" && !loading && (
          <>
            <div style={{ background: "linear-gradient(135deg,var(--purple-dim),rgba(124,58,237,0.04))", border: "1px solid var(--purple-border)", borderRadius: "var(--r)", padding: 20, marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 44, fontWeight: 700, color: "var(--purple-light)", lineHeight: 1 }}>{user.points || 0}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, letterSpacing: ".5px", textTransform: "uppercase" }}>Points totaux</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, background: "var(--purple)", color: "#fff", fontSize: 11, fontWeight: 600, marginTop: 10 }}>
                <Crown size={12} />Niveau {level}
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "var(--bg4)", overflow: "hidden", marginTop: 12 }}>
                <div style={{ height: "100%", width: `${xpPct}%`, background: "linear-gradient(90deg,var(--purple),var(--purple-light))", borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginTop: 5 }}>
                <span>{xpCurr} pts</span><span>{xpNext} pts → Niveau {level + 1}</span>
              </div>
            </div>

            {[
              { Icon: Star,     c: "var(--yellow)",       bg: "var(--yellow-dim)", l: "Laisser un avis",        pts: "+50 pts" },
              { Icon: Flag,     c: "var(--blue)",         bg: "var(--blue-dim)",   l: "Signaler un bug",        pts: "+30 pts" },
              { Icon: UserPlus, c: "var(--green)",        bg: "var(--green-dim)",  l: "Parrainer un ami",       pts: "+100 pts" },
              { Icon: Activity, c: "var(--orange)",       bg: "var(--orange-dim)", l: "Connexion quotidienne",  pts: "+5 pts" },
            ].map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 13, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><e.Icon size={16} color={e.c} /></div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{e.l}</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: e.c }}>{e.pts}</div>
              </div>
            ))}
          </>
        )}

        {/* COINS */}
        {tab === "coins" && !loading && (
          <>
            <div style={{ background: "var(--yellow-dim)", border: "1px solid var(--yellow-border)", borderRadius: "var(--r)", padding: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: "var(--yellow-dim)", border: "1px solid var(--yellow-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 22 }}>⬡</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--yellow)" }}>{user.coins || 0}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Coins disponibles</div>
              </div>
            </div>

            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Historique <span style={{ color: "var(--purple-light)" }}>transactions</span></div>
            <Card>
              {transactions.length === 0
                ? <div style={{ textAlign: "center", padding: 20, color: "var(--text3)", fontSize: 13 }}>Aucune transaction</div>
                : transactions.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < transactions.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: t.amount > 0 ? "var(--green-dim)" : "var(--red-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {t.amount > 0 ? <Gift size={14} color="var(--green)" /> : <Package size={14} color="var(--red)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>{new Date(t.createdAt).toLocaleDateString("fr")}</div>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: t.amount > 0 ? "var(--green)" : "var(--red)" }}>
                      {t.amount > 0 ? "+" : ""}{t.amount}
                    </div>
                  </div>
                ))
              }
            </Card>
          </>
        )}

        {/* BADGES */}
        {tab === "badges" && !loading && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.entries(BADGES_INFO).map(([id, info]) => {
                const owned = user.badges?.includes(id);
                return (
                  <div key={id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 16, textAlign: "center", opacity: owned ? 1 : .45, filter: owned ? "none" : "grayscale(1)" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: info.bg, border: `1px solid ${info.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <info.Icon size={22} color={info.color} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>{info.name}</div>
                    <Badge variant={owned ? "green" : "purple"} style={{ fontSize: 9 }}>{owned ? "Obtenu" : "Verrouillé"}</Badge>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PARRAINAGE */}
        {tab === "referral" && !loading && (
          <>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                Ton lien de <span style={{ color: "var(--purple-light)" }}>parrainage</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 12 }}>
                Chaque ami inscrit = <strong style={{ color: "var(--purple-light)" }}>100 points</strong> + 50 coins.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", border: "1px solid var(--purple-border)", borderRadius: 9, padding: "10px 12px", marginBottom: 12 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--purple-light)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {window.location.origin}/auth?ref={user.referralCode}
                </span>
                <Copy size={13} color="var(--text3)" style={{ cursor: "pointer", flexShrink: 0 }} onClick={copyRef} />
              </div>
              <Btn style={{ width: "100%" }} onClick={copyRef}><Share2 size={13} />Partager mon lien</Btn>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { n: user.referrals?.length || 0, l: "Filleuls" },
                { n: (user.referrals?.length || 0) * 100, l: "Pts gagnés" },
                { n: Math.floor((user.referrals?.length || 0) / 3), l: "Bots offerts" },
              ].map(s => (
                <div key={s.l} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 9, padding: 12, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--purple-light)" }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* NOTIFS */}
        {tab === "notifs" && !loading && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700 }}><span style={{ color: "var(--purple-light)" }}>Notifications</span></div>
              {unread > 0 && <div onClick={markAllRead} style={{ fontSize: 11, color: "var(--purple-light)", cursor: "pointer" }}>Tout lire</div>}
            </div>
            <Card>
              {notifs.length === 0
                ? <div style={{ textAlign: "center", padding: 20, color: "var(--text3)", fontSize: 13 }}>Aucune notification</div>
                : notifs.map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 0", borderBottom: i < notifs.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--purple-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bell size={14} color="var(--purple-light)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3 }}>{n.body}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>{new Date(n.createdAt).toLocaleString("fr")}</div>
                    </div>
                    {!n.isRead && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--purple-light)", flexShrink: 0, marginTop: 3 }} />}
                  </div>
                ))
              }
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
