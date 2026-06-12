# DevHub Frontend

Interface React + Vite pour la plateforme DevHub.

---

## Stack
- **Framework** : React 18 + Vite
- **Routing** : React Router v6
- **HTTP** : Axios
- **Icons** : Lucide React
- **Déploiement** : Vercel

---

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le .env
cp .env.example .env

# 3. Remplir les variables

# 4. Lancer en dev
npm run dev

# 5. Build production
npm run build
```

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL du backend (ex: https://ton-backend.onrender.com/api) |
| `VITE_ADMIN_PASSWORD` | Mot de passe admin (optionnel côté front) |

---

## Déploiement sur Vercel

1. Push le dossier sur GitHub
2. Importer le projet sur Vercel
3. Ajouter `VITE_API_URL` dans les variables d'environnement
4. Deploy

---

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/projects` | Catalogue projets |
| `/projects/:id` | Détail projet |
| `/events` | Événements actifs |
| `/leaderboard` | Classement |
| `/status` | Uptime des projets |
| `/changelog` | Historique versions |
| `/community` | Canaux + Avis + Bugs |
| `/auth` | Connexion / Inscription |
| `/dashboard` | Compte utilisateur |
| `/admin-login` | Login admin |
| `/admin` | Panel admin |

---

## Structure

```
src/
├── api/
│   └── axios.js          # Instance Axios + admin
├── context/
│   └── AuthContext.jsx   # Auth globale JWT
├── hooks/
│   └── useToast.js       # Toast notifications
├── components/
│   ├── LoadingScreen.jsx # Grid Reveal loader
│   ├── Navbar.jsx        # Navigation top
│   ├── BottomNav.jsx     # Navigation bas mobile
│   ├── Toast.jsx         # Notifications
│   ├── ProjectCard.jsx   # Card projet réutilisable
│   └── ui.jsx            # Composants UI (Btn, Card, Badge...)
├── pages/
│   ├── Home.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── Events.jsx
│   ├── Leaderboard.jsx
│   ├── Status.jsx
│   ├── Changelog.jsx
│   ├── Community.jsx
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   ├── AdminLogin.jsx
│   └── Admin.jsx
├── App.jsx               # Router principal
├── main.jsx
└── index.css             # Variables CSS globales
```
