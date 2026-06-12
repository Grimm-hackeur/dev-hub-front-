import { Layers } from "lucide-react";

const S = {
  wrap: {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "var(--bg)", display: "flex",
    alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(124,58,237,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.07) 1px,transparent 1px)",
    backgroundSize: "40px 40px",
    animation: "fadeIn .8s ease forwards",
  },
  glow: {
    position: "absolute", width: 320, height: 320, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)",
    animation: "pulse 2s ease-in-out infinite",
  },
  center: { position: "relative", zIndex: 1, textAlign: "center" },
  ringWrap: { width: 80, height: 80, position: "relative", margin: "0 auto 22px" },
  ring: {
    width: 80, height: 80, borderRadius: "50%",
    border: "2px solid transparent",
    borderTopColor: "var(--purple-light)",
    borderRightColor: "var(--purple)",
    animation: "spin 1s linear infinite",
    position: "absolute", inset: 0,
  },
  ringInner: {
    width: 60, height: 60, borderRadius: "50%",
    border: "2px solid transparent",
    borderBottomColor: "var(--purple-light)",
    animation: "spin 1.5s linear infinite reverse",
    position: "absolute", top: 10, left: 10,
  },
  logoInner: {
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  name: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 26, fontWeight: 700,
    animation: "fadeUp .6s ease .3s both",
    marginBottom: 6,
  },
  nameSpan: { color: "var(--purple-light)" },
  tag: {
    fontSize: 10, color: "var(--text3)",
    letterSpacing: 2, textTransform: "uppercase",
    animation: "fadeUp .6s ease .5s both",
  },
};

export default function LoadingScreen() {
  return (
    <div style={S.wrap}>
      <div style={S.grid} />
      <div style={S.glow} />
      <div style={S.center}>
        <div style={S.ringWrap}>
          <div style={S.ring} />
          <div style={S.ringInner} />
          <div style={S.logoInner}>
            <Layers size={22} color="var(--purple-light)" />
          </div>
        </div>
        <div style={S.name}>DEV<span style={S.nameSpan}>HUB</span></div>
        <div style={S.tag}>Premium Tech Platform</div>
      </div>
    </div>
  );
}
