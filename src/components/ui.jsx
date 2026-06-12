// Composants UI réutilisables

export const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--r)", padding: 16,
    cursor: onClick ? "pointer" : "default",
    transition: "border-color .2s, background .2s",
    ...style,
  }}>
    {children}
  </div>
);

export const Btn = ({ children, variant = "purple", size = "md", style = {}, onClick, disabled }) => {
  const variants = {
    purple: { background: "var(--purple)", color: "#fff", border: "none" },
    ghost:  { background: "transparent", color: "var(--text2)", border: "1px solid var(--border2)" },
    green:  { background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green-border)" },
    red:    { background: "var(--red-dim)", color: "var(--red)", border: "1px solid var(--red-border)" },
    yellow: { background: "var(--yellow-dim)", color: "var(--yellow)", border: "1px solid var(--yellow-border)" },
    blue:   { background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue-border)" },
  };
  const sizes = {
    xs: { padding: "5px 10px", fontSize: 10, borderRadius: 7 },
    sm: { padding: "7px 14px", fontSize: 11, borderRadius: 8 },
    md: { padding: "10px 18px", fontSize: 13, borderRadius: 10 },
    lg: { padding: "13px 24px", fontSize: 14, borderRadius: 11 },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      justifyContent: "center", transition: "all .2s",
      opacity: disabled ? .5 : 1,
      ...variants[variant], ...sizes[size], ...style,
    }}>
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = "purple", style = {} }) => {
  const variants = {
    purple: { background: "var(--purple-dim)", color: "var(--purple-light)", border: "1px solid var(--purple-border)" },
    green:  { background: "var(--green-dim)",  color: "var(--green)",        border: "1px solid var(--green-border)" },
    yellow: { background: "var(--yellow-dim)", color: "var(--yellow)",       border: "1px solid var(--yellow-border)" },
    blue:   { background: "var(--blue-dim)",   color: "var(--blue)",         border: "1px solid var(--blue-border)" },
    orange: { background: "var(--orange-dim)", color: "var(--orange)",       border: "1px solid var(--orange-border)" },
    red:    { background: "var(--red-dim)",    color: "var(--red)",          border: "1px solid var(--red-border)" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 100,
      fontSize: 10, fontWeight: 600,
      ...variants[variant], ...style,
    }}>
      {children}
    </span>
  );
};

export const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 13 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>{label}</label>}
    <input {...props} style={{
      width: "100%", padding: "10px 13px",
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none",
      transition: "border .18s",
      ...props.style,
    }} />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 13 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>{label}</label>}
    <select {...props} style={{
      appearance: "none", width: "100%", padding: "10px 13px",
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none", cursor: "pointer",
      ...props.style,
    }}>
      {children}
    </select>
  </div>
);

export const Textarea = ({ label, ...props }) => (
  <div style={{ marginBottom: 13 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text2)", marginBottom: 5 }}>{label}</label>}
    <textarea {...props} style={{
      width: "100%", padding: "10px 13px",
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 9, color: "var(--text)", fontSize: 13, outline: "none",
      resize: "vertical", minHeight: 80, transition: "border .18s",
      ...props.style,
    }} />
  </div>
);

export const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: "var(--border)", margin: "14px 0", ...style }} />
);

export const Spinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--purple-light)", animation: "spin 1s linear infinite" }} />
);

export const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>
    {children}
  </div>
);

export const SectionTitle = ({ children }) => (
  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
    {children}
  </div>
);
