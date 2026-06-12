import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layers, Mail, Lock, User, Eye, EyeOff, ArrowRight, UserPlus, MessageCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Btn, Card, Divider } from "../components/ui";

export default function Auth({ showToast }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");
  const [form, setForm] = useState({ pseudo: "", email: "", password: "", referralCode: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Remplis tous les champs."); return; }
    if (mode === "register" && !form.pseudo) { setError("Entre ton pseudo."); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.pseudo, form.email, form.password, form.referralCode);
      }
      showToast(mode === "login" ? "Bienvenue !" : "Compte créé ! Vérifie ton email.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 58px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px 80px", position: "relative" }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 350, height: 350, background: "radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Layers size={22} color="#fff" />
          </div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 5 }}>
            {mode === "login" ? "Content de te revoir" : "Rejoins DevHub"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            {mode === "login" ? "Connecte-toi à ton espace" : "Crée ton compte gratuitement"}
          </div>
        </div>

        <Card>
          {/* Erreur */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 8, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 12, marginBottom: 14 }}>
              ⚠ {error}
            </div>
          )}

          {/* Pseudo (register) */}
          {mode === "register" && (
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Pseudo</label>
              <div style={{ position: "relative" }}>
                <User size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
                <input
                  placeholder="ton_pseudo" value={form.pseudo}
                  onChange={e => set("pseudo", e.target.value)}
                  style={{ width: "100%", padding: "10px 13px 10px 34px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 13 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
              <input
                type="email" placeholder="ton@email.com" value={form.email}
                onChange={e => set("email", e.target.value)}
                style={{ width: "100%", padding: "10px 13px 10px 34px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: mode === "register" ? 13 : 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <Lock size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
              <input
                type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password}
                onChange={e => set("password", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "10px 38px 10px 34px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}
              />
              <div onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text3)" }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </div>
            </div>
          </div>

          {/* Code parrainage (register) */}
          {mode === "register" && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Code parrainage (optionnel)</label>
              <input
                placeholder="Ex: ZEPHYR-X92K" value={form.referralCode}
                onChange={e => set("referralCode", e.target.value)}
                style={{ width: "100%", padding: "10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}
              />
            </div>
          )}

          <Btn style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
            {loading
              ? <RefreshCw size={14} className="spin" />
              : mode === "login"
                ? <><ArrowRight size={14} />Se connecter</>
                : <><UserPlus size={14} />Créer mon compte</>
            }
          </Btn>

          <Divider />

          <Btn variant="ghost" style={{ width: "100%" }}>
            <MessageCircle size={14} />Continuer via WhatsApp
          </Btn>
        </Card>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text2)" }}>
          {mode === "login"
            ? <>Pas de compte ? <span onClick={() => setMode("register")} style={{ color: "var(--purple-light)", cursor: "pointer", fontWeight: 500 }}>S'inscrire</span></>
            : <>Déjà un compte ? <span onClick={() => setMode("login")} style={{ color: "var(--purple-light)", cursor: "pointer", fontWeight: 500 }}>Se connecter</span></>
          }
        </div>
      </div>
    </div>
  );
}
