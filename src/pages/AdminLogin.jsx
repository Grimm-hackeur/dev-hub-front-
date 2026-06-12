import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, AlertTriangle, RefreshCw } from "lucide-react";
import { adminApi } from "../api/axios";
import { Btn, Card } from "../components/ui";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!pw) { setError("Entre le mot de passe."); return; }
    setLoading(true); setError("");
    sessionStorage.setItem("devhub_admin_pw", pw);
    try {
      await adminApi.post("/admin/login");
      navigate("/admin");
    } catch {
      sessionStorage.removeItem("devhub_admin_pw");
      setError("Mot de passe incorrect.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, background: "radial-gradient(circle,rgba(248,113,113,0.05),transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "var(--red-dim)", border: "1px solid var(--red-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Shield size={26} color="var(--red)" />
          </div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Accès Admin</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Réservé uniquement à l'administrateur</div>
        </div>

        <Card>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", borderRadius: 8, background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", fontSize: 12, marginBottom: 14 }}>
              <AlertTriangle size={13} />{error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>Mot de passe secret</label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"} placeholder="••••••••••" value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width: "100%", padding: "10px 38px 10px 13px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none" }}
              />
              <div onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text3)" }}>
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </div>
            </div>
          </div>

          <Btn style={{ width: "100%" }} onClick={handleLogin} disabled={loading}>
            {loading ? <RefreshCw size={14} className="spin" /> : <><Shield size={14} />Accéder au panel</>}
          </Btn>
        </Card>
      </div>
    </div>
  );
}
