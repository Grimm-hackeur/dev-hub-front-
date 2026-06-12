import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useToast } from "./hooks/useToast";
import api from "./api/axios";

import LoadingScreen from "./components/LoadingScreen";
import Navbar        from "./components/Navbar";
import BottomNav     from "./components/BottomNav";
import Toast         from "./components/Toast";

import Home          from "./pages/Home";
import Projects      from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Events        from "./pages/Events";
import Leaderboard   from "./pages/Leaderboard";
import Status        from "./pages/Status";
import Changelog     from "./pages/Changelog";
import Community     from "./pages/Community";
import Auth          from "./pages/Auth";
import Dashboard     from "./pages/Dashboard";
import AdminLogin    from "./pages/AdminLogin";
import Admin         from "./pages/Admin";

function AppContent() {
  const location = useLocation();
  const { toast, showToast } = useToast();
  const [appLoading, setAppLoading]   = useState(true);
  const [banner, setBanner]           = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [unread, setUnread]           = useState(0);

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Loading screen
  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Fetch banner
  useEffect(() => {
    api.get("/admin/banner").then(r => {
      if (r.data.banner) setBanner(r.data.banner);
    }).catch(() => {});
  }, []);

  // Fetch unread notifs
  useEffect(() => {
    const token = localStorage.getItem("devhub_token");
    if (!token) return;
    api.get("/notifications").then(r => setUnread(r.data.unread || 0)).catch(() => {});
  }, [location.pathname]);

  if (appLoading) return <LoadingScreen />;

  return (
    <div>
      {!isAdminRoute && (
        <Navbar
          unread={unread}
          banner={bannerVisible ? banner : null}
          onCloseBanner={() => setBannerVisible(false)}
        />
      )}

      <div style={{ paddingTop: isAdminRoute ? 0 : (bannerVisible && banner?.isActive ? 96 : 58) }}>
        <Routes>
          <Route path="/"             element={<Home        showToast={showToast} />} />
          <Route path="/projects"     element={<Projects    showToast={showToast} />} />
          <Route path="/projects/:id" element={<ProjectDetail showToast={showToast} />} />
          <Route path="/events"       element={<Events      showToast={showToast} />} />
          <Route path="/leaderboard"  element={<Leaderboard />} />
          <Route path="/status"       element={<Status      showToast={showToast} />} />
          <Route path="/changelog"    element={<Changelog />} />
          <Route path="/community"    element={<Community   showToast={showToast} />} />
          <Route path="/auth"         element={<Auth        showToast={showToast} />} />
          <Route path="/dashboard"    element={<Dashboard   showToast={showToast} />} />
          <Route path="/admin-login"  element={<AdminLogin />} />
          <Route path="/admin"        element={<Admin       showToast={showToast} />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </div>

      {!isAdminRoute && <BottomNav unread={unread} />}
      <Toast toast={toast} />
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text3)", padding: 24 }}>
      <div style={{ fontSize: 64, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "var(--purple-light)", marginBottom: 12 }}>404</div>
      <div style={{ fontSize: 16, marginBottom: 20 }}>Page introuvable</div>
      <a href="/" style={{ color: "var(--purple-light)", fontSize: 13 }}>← Retour à l'accueil</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}