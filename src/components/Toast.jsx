import { CheckCircle, AlertTriangle, X } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div style={{
      position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, padding: "10px 18px", borderRadius: 10,
      background: "var(--bg3)",
      border: `1px solid ${isErr ? "var(--red-border)" : "var(--purple-border)"}`,
      color: "var(--text)", fontSize: 12, fontWeight: 500,
      whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 24px rgba(0,0,0,.5)",
      animation: "slideDown .25s ease",
    }}>
      {isErr
        ? <AlertTriangle size={14} color="var(--red)" />
        : <CheckCircle size={14} color="var(--green)" />
      }
      {toast.message}
    </div>
  );
}
