import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Package, Activity, Download, LogOut, Plus, Edit, Trash2, Wifi, WifiOff, Gift, Key, Award, Mail, Ban, Unlock, Search, Save, X, Megaphone, Bell, ToggleLeft, ToggleRight, Zap, Crown, Ticket, CheckCircle, AlertTriangle } from "lucide-react";
import { adminApi } from "../api/axios";
import { Btn, Card, Spinner, Divider, Input, Select, Textarea } from "../components/ui";

const ADMIN_TABS = [
  { id: "stats",     label: "Stats",    Icon: Activity },
  { id: "projects",  label: "Projets",  Icon: Package },
  { id: "users",     label: "Users",    Icon: Users },
  { id: "events",    label: "Events",   Icon: Zap },
  { id: "comms",     label: "Comms",    Icon: Megaphone },
];

export default function Admin({ showToast }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("devhub_admin_pw")) { navigate("/admin-login"); return; }
    loadTab(tab);
  }, [tab]);

  const loadTab = async (t) => {
    setLoading(true);
    try {
      if (t === "stats") {
        const r = await adminApi.get("/admin/stats");
        setStats(r.data);
      } else if (t === "projects") {
        const r = await adminApi.get("/admin/projects");
        setProjects(r.data.projects || []);
      } else if (t === "users") {
        const r = await adminApi.get("/admin/users");
        setUsers(r.data.users || []);
      }
    } catch (err) {
      if (err.response?.status === 403) { navigate("/admin-login"); }
    } finally { setLoading(false); }
  };

  const toggleProject = async (id) => {
    await adminApi.patch(`/admin/projects/${id}/toggle`);
    setProjects(p => p.map(x => x._id === id ? { ...x, isActive: !x.isActive } : x));
    showToast("Statut mis à jour");
  };

  const deleteProject = async (id) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await adminApi.delete(`/admin/projects/${id}`);
    setProjects(p => p.filter(x => x._id !== id));
    showToast("Projet supprimé");
  };

  const toggleSuspend = async (u) => {
    if (u.isSuspended) {
      await adminApi.post(`/admin/users/${u._id}/unsuspend`);
      setUsers(us => us.map(x => x._id === u._id ? { ...x, isSuspended: false } : x));
      showToast(`${u.pseudo} débloqué`);
    } else {
      setModal({ type: "suspend", data: u });
    }
  };

  const logout = () => { sessionStorage.removeItem("devhub_admin_pw"); navigate("/"); };
  const filteredUsers = users.filter(u => !search || u.pseudo?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "16px 18px 0", display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <Shield size={16} color="var(--red)" />
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700 }}>Panel Admin</div>
        <div style={{ padding: "2px 8px", borderRadius: 6, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 9, fontWeight: 700 }}>ADMIN</div>
        <div onClick={logout} style={{ marginLeft: "auto", cursor: "pointer", color: "var(--text3)" }}><LogOut size={16} /></div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "10px 18px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
        {ADMIN_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
            padding: "6px 13px", borderRadius: 9, fontSize: 11, fontWeight: 500,
            cursor: "pointer", border: tab === t.id ? "none" : "1px solid var(--border)",
            background: tab === t.id ? "var(--purple-dim)" : "transparent",
            borderColor: tab === t.id ? "var(--purple-border)" : "var(--border)",
            color: tab === t.id ? "var(--purple-light)" : "var(--text3)",
          }}>
            <t.Icon size={12} />{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 18px" }}>
        {loading && <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>}

        {/* STATS */}
        {tab === "stats" && !loading && stats && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { Icon: Users,    bg: "var(--purple-dim)", c: "var(--purple-light)", n: stats.stats?.totalUsers,    l: "Utilisateurs" },
                { Icon: Package,  bg: "var(--blue-dim)",   c: "var(--blue)",         n: stats.stats?.totalProjects,  l: "Projets actifs" },
                { Icon: Download, bg: "var(--green-dim)",  c: "var(--green)",        n: stats.stats?.totalLicenses,  l: "Licences" },
                { Icon: Activity, bg: "var(--yellow-dim)", c: "var(--yellow)",       n: stats.stats?.totalReviews,   l: "Avis" },
              ].map((k, i) => (
                <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><k.Icon size={15} color={k.c} /></div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: k.c, marginBottom: 2 }}>{k.n || 0}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{k.l}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              En ligne <span style={{ color: "var(--green)" }}>maintenant ({stats.onlineUsers?.length || 0})</span>
            </div>
            <Card>
              {(stats.onlineUsers || []).length === 0
                ? <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: 12 }}>Aucun utilisateur en ligne</div>
                : (stats.onlineUsers || []).map((u, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < stats.onlineUsers.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px rgba(34,197,94,.6)", animation: "ping 1.5s infinite" }} />
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{u.pseudo}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{new Date(u.lastLogin).toLocaleTimeString("fr")}</div>
                  </div>
                ))
              }
            </Card>

            <Btn style={{ width: "100%", marginTop: 12 }} variant="ghost"
              onClick={async () => { const r = await adminApi.get("/admin/users/export"); const b = new Blob([r.data], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "devhub-users.csv"; a.click(); showToast("Export téléchargé !"); }}>
              <Download size={14} />Exporter users (CSV)
            </Btn>
          </>
        )}

        {/* PROJECTS */}
        {tab === "projects" && !loading && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700 }}>Projets <span style={{ color: "var(--purple-light)" }}>({projects.length})</span></div>
              <Btn size="xs" onClick={() => setModal({ type: "add_project" })}><Plus size={11} />Ajouter</Btn>
            </div>
            {projects.map((p, i) => (
              <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 11, padding: 12, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package size={16} color="var(--purple-light)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{p.type} · {p.price} coins · {p.views} vues</div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div onClick={() => toggleProject(p._id)} style={{ width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: p.isActive ? "var(--green-dim)" : "var(--red-dim)", border: `1px solid ${p.isActive ? "var(--green-border)" : "var(--red-border)"}`, color: p.isActive ? "var(--green)" : "var(--red)" }}>
                    {p.isActive ? <Wifi size={12} /> : <WifiOff size={12} />}
                  </div>
                  <div onClick={() => deleteProject(p._id)} style={{ width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)" }}>
                    <Trash2 size={12} />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* USERS */}
        {tab === "users" && !loading && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
                <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "9px 13px 9px 32px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 12, outline: "none" }} />
              </div>
            </div>
            {filteredUsers.map((u, i) => (
              <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 11, padding: 12, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--bg4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--text2)", flexShrink: 0 }}>
                  {u.pseudo?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                    {u.pseudo}
                    {u.isSuspended && <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 100, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontWeight: 700 }}>SUSPENDU</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{u.coins}⬡ · {u.points}pts</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { Icon: Gift,   bg: "var(--yellow-dim)", border: "var(--yellow-border)", c: "var(--yellow)",       fn: () => setModal({ type: "gift_coins", data: u }), title: "Coins" },
                    { Icon: Key,    bg: "var(--green-dim)",  border: "var(--green-border)",  c: "var(--green)",        fn: () => setModal({ type: "give_access", data: u }), title: "Accès" },
                    { Icon: Award,  bg: "var(--purple-dim)", border: "var(--purple-border)", c: "var(--purple-light)", fn: () => setModal({ type: "give_badge", data: u }), title: "Badge" },
                    { Icon: Mail,   bg: "var(--blue-dim)",   border: "var(--blue-border)",   c: "var(--blue)",         fn: () => setModal({ type: "send_msg", data: u }), title: "Msg" },
                    { Icon: u.isSuspended ? Unlock : Ban, bg: "var(--red-dim)", border: "var(--red-border)", c: "var(--red)", fn: () => toggleSuspend(u), title: u.isSuspended ? "Débloquer" : "Suspendre" },
                  ].map((a, j) => (
                    <div key={j} onClick={a.fn} title={a.title} style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: a.bg, border: `1px solid ${a.border}`, color: a.c }}>
                      <a.Icon size={11} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* EVENTS */}
        {tab === "events" && !loading && <AdminEvents showToast={showToast} />}

        {/* COMMS */}
        {tab === "comms" && !loading && <AdminComms showToast={showToast} />}
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end" }} onClick={() => setModal(null)}>
          <div style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px 20px 0 0", padding: "22px 20px 36px", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border2)", margin: "0 auto 18px" }} />
            <AdminModal modal={modal} setModal={setModal} showToast={showToast} reloadUsers={() => loadTab("users")} />
          </div>
        </div>
      )}
    </div>
  );
}

function AdminModal({ modal, setModal, showToast, reloadUsers }) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    try {
      const u = modal.data;
      if (modal.type === "gift_coins") {
        await adminApi.post(`/admin/users/${u._id}/gift-coins`, { amount: parseInt(form.amount), reason: form.reason });
        showToast(`+${form.amount} coins envoyés !`);
      } else if (modal.type === "give_access") {
        await adminApi.post(`/admin/users/${u._id}/give-access`, { projectId: form.projectId });
        showToast("Accès accordé !");
      } else if (modal.type === "give_badge") {
        await adminApi.post(`/admin/users/${u._id}/give-badge`, { badge: form.badge || "first_access" });
        showToast("Badge attribué !");
      } else if (modal.type === "send_msg") {
        await adminApi.post(`/admin/users/${u._id}/message`, { title: form.title, body: form.body });
        showToast("Message envoyé !");
      } else if (modal.type === "suspend") {
        await adminApi.post(`/admin/users/${u._id}/suspend`, { reason: form.reason, duration: form.duration ? parseInt(form.duration) : null });
        showToast(`${u.pseudo} suspendu`);
        reloadUsers();
      } else if (modal.type === "add_project") {
        await adminApi.post("/admin/projects", form);
        showToast("Projet publié !");
      }
      setModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    }
  };

  const titles = { gift_coins: "Donner des coins", give_access: "Donner un accès gratuit", give_badge: "Attribuer un badge", send_msg: "Message privé", suspend: "Suspendre", add_project: "Ajouter un projet" };

  return (
    <>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{titles[modal.type]}</div>
      {modal.data && <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Pour {modal.data.pseudo}</div>}

      {modal.type === "gift_coins" && <>
        <div style={{ marginBottom: 13 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Montant</label><input className="fi" type="number" placeholder="100" onChange={e => set("amount", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Motif (optionnel)</label><input placeholder="Cadeau de bienvenue" onChange={e => set("reason", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
      </>}

      {modal.type === "give_badge" && (
        <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Badge</label>
          <select onChange={e => set("badge", e.target.value)} style={{ appearance: "none", width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}>
            {["first_access", "beta_tester", "top_contributor", "referral_elite", "faithful", "legend"].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}

      {modal.type === "send_msg" && <>
        <div style={{ marginBottom: 13 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Titre</label><input placeholder="Titre" onChange={e => set("title", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Message</label><textarea placeholder="Ton message..." onChange={e => set("body", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", minHeight: 80 }} /></div>
      </>}

      {modal.type === "suspend" && <>
        <div style={{ marginBottom: 13 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Motif</label><input placeholder="Raison de la suspension" onChange={e => set("reason", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Durée (heures, vide = indéfini)</label><input type="number" placeholder="24" onChange={e => set("duration", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
      </>}

      {modal.type === "add_project" && <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Nom</label><input placeholder="PHANTOM-WA" onChange={e => set("name", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Type</label><select onChange={e => set("type", e.target.value)} style={{ appearance: "none", width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}><option>Bot</option><option>Tool</option><option>Template</option></select></div>
        </div>
        <div style={{ marginBottom: 10 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Description</label><textarea placeholder="Décris le projet..." onChange={e => set("description", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", minHeight: 70 }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Prix (coins)</label><input type="number" placeholder="150" onChange={e => set("price", parseInt(e.target.value))} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
          <div><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Statut</label><select onChange={e => set("status", e.target.value)} style={{ appearance: "none", width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}><option value="active">Actif</option><option value="beta">Beta</option><option value="soon">Bientôt</option></select></div>
        </div>
      </>}

      <Btn style={{ width: "100%" }} onClick={submit}><Save size={14} />Confirmer</Btn>
    </>
  );
}

function AdminEvents({ showToast }) {
  const [evType, setEvType] = useState("flash");
  const [form, setForm] = useState({ notifyUsers: true, featuredOnHome: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const createEvent = async () => {
    try {
      await adminApi.post("/admin/events", { ...form, type: evType });
      showToast("Événement lancé !");
    } catch (err) { showToast(err.response?.data?.message || "Erreur", "error"); }
  };

  return (
    <div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Créer un <span style={{ color: "var(--purple-light)" }}>événement</span></div>
      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[{ v: "flash", l: "Flash Deal", Icon: Zap }, { v: "limited", l: "Limité", Icon: Crown }].map(t => (
            <button key={t.v} onClick={() => setEvType(t.v)} style={{ flex: 1, padding: 10, borderRadius: 10, textAlign: "center", fontSize: 12, fontWeight: 600, cursor: "pointer", border: evType === t.v ? "none" : "1px solid var(--border)", background: evType === t.v ? (t.v === "flash" ? "var(--orange-dim)" : "var(--purple-dim)") : "transparent", borderColor: evType === t.v ? (t.v === "flash" ? "var(--orange-border)" : "var(--purple-border)") : "var(--border)", color: evType === t.v ? (t.v === "flash" ? "var(--orange)" : "var(--purple-light)") : "var(--text3)", fontFamily: "'Inter',sans-serif" }}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>ID Projet</label><input placeholder="ID du projet MongoDB" onChange={e => set("project", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
        <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Titre</label><input placeholder="Ex: PHANTOM-WA à -50%" onChange={e => set("title", e.target.value)} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>

        {evType === "flash" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Prix promo (coins)</label><input type="number" placeholder="75" onChange={e => set("promoPrice", parseInt(e.target.value))} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Durée (heures)</label><input type="number" placeholder="6" onChange={e => { const h = parseInt(e.target.value); set("endsAt", new Date(Date.now() + h * 3600000).toISOString()); }} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
          </div>
        ) : (
          <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Nb de places</label><input type="number" placeholder="10" onChange={e => set("maxSlots", parseInt(e.target.value))} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
        )}

        {[{ k: "notifyUsers", l: "Notifier tous les users" }, { k: "featuredOnHome", l: "Mettre en avant sur Home" }].map(t => (
          <div key={t.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>{t.l}</span>
            <div onClick={() => set(t.k, !form[t.k])} style={{ cursor: "pointer" }}>
              {form[t.k] ? <ToggleRight size={22} color="var(--purple-light)" /> : <ToggleLeft size={22} color="var(--text3)" />}
            </div>
          </div>
        ))}

        <Btn style={{ width: "100%", marginTop: 4 }} onClick={createEvent}><Zap size={13} />Lancer l'événement</Btn>
      </Card>
    </div>
  );
}

function AdminComms({ showToast }) {
  const [tab, setTab] = useState("banner");
  const [bannerText, setBannerText] = useState("");
  const [bannerColor, setBannerColor] = useState("purple");
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");

  const publishBanner = async () => {
    try {
      await adminApi.post("/admin/banner", { text: bannerText, color: bannerColor });
      showToast("Bannière publiée !");
    } catch { showToast("Erreur", "error"); }
  };

  const sendPush = async () => {
    try {
      const r = await adminApi.post("/admin/push", { title: pushTitle, body: pushBody });
      showToast(r.data.message);
    } catch { showToast("Erreur", "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[{ id: "banner", l: "Bannière" }, { id: "push", l: "Notif push" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "6px 13px", borderRadius: 9, fontSize: 11, fontWeight: 500, cursor: "pointer", border: tab === t.id ? "none" : "1px solid var(--border)", background: tab === t.id ? "var(--purple-dim)" : "transparent", borderColor: tab === t.id ? "var(--purple-border)" : "var(--border)", color: tab === t.id ? "var(--purple-light)" : "var(--text3)", fontFamily: "'Inter',sans-serif" }}>{t.l}</button>
        ))}
      </div>

      {tab === "banner" && (
        <Card>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Megaphone size={15} color="var(--purple-light)" />Bannière <span style={{ color: "var(--purple-light)" }}>globale</span></div>
          <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Message</label><textarea value={bannerText} onChange={e => setBannerText(e.target.value)} placeholder="Message de la bannière..." rows={2} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none", resize: "none" }} /></div>
          <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Couleur</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["purple", "green", "yellow", "blue"].map(c => (
                <div key={c} onClick={() => setBannerColor(c)} style={{ width: 28, height: 28, borderRadius: 7, cursor: "pointer", border: `2px solid ${bannerColor === c ? "white" : "transparent"}`, background: c === "purple" ? "var(--purple)" : c === "green" ? "var(--green)" : c === "yellow" ? "var(--yellow)" : "var(--blue)" }} />
              ))}
            </div>
          </div>
          <Btn style={{ width: "100%" }} onClick={publishBanner}><Save size={13} />Publier la bannière</Btn>
        </Card>
      )}

      {tab === "push" && (
        <Card>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Bell size={15} color="var(--purple-light)" />Notif <span style={{ color: "var(--purple-light)" }}>push globale</span></div>
          <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Titre</label><input value={pushTitle} onChange={e => setPushTitle(e.target.value)} placeholder="Titre de la notification..." style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }} /></div>
          <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Message</label><textarea value={pushBody} onChange={e => setPushBody(e.target.value)} placeholder="Corps de la notification..." rows={3} style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none", resize: "none" }} /></div>
          <Btn style={{ width: "100%" }} onClick={sendPush} disabled={!pushTitle || !pushBody}><Bell size={13} />Envoyer à tous</Btn>
        </Card>
      )}
    </div>
  );
}
