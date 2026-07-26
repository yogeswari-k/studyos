<div align="center">

# ⚡ StudyOS

**An all-in-one Progressive Web App to help students manage goals, academics, health, and wellness in one place.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://studyos-kappa.vercel.app)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)
![License](https://img.shields.io/badge/license-MIT-blue)

[Live Demo](https://studyos-kappa.vercel.app) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>

---

## 📖 Overview

StudyOS is a personal productivity dashboard built for students, bringing together **academics, goal tracking, health monitoring, and wellness** into a single installable web app. It's designed to reduce the need to juggle multiple apps for planning study schedules, tracking habits, and staying on top of personal wellbeing.

Built as a full-stack solo project with real-time cloud sync via Firebase, and installable as a native-feeling app on Android/desktop through PWA support.

## 📸 Screenshots

<!--
Add your screenshots to a `screenshots/` folder in the repo root, then reference them below.
Suggested shots: Login, Dashboard, Goals, Health, Learning Path, Profile (light + dark mode).
-->

| Dashboard | Goals | Health | Profile
|---|---|---|---|
| ![Dashboard](screenshots/scholar_dashboard.png) | ![Goals](screenshots/Scholar_Goals.png) | ![Health](screenshots/Scholar_Health.png) |![Profile](screenshots/Scholar_Profile.png)|

## ✨ Features

- 🔐 **Authentication** — secure sign-up/login powered by Firebase Auth
- 🏠 **Dashboard** — a unified home view summarizing goals, health, and study progress at a glance
- 🎯 **Goals** — create, track, and get reminders for personal and academic goals
- 📚 **Learning Path** — structured tracking of academic/learning progress
- ❤️ **Health Tracking** — log and monitor personal health/wellness metrics
- 👤 **Profile** — manage personal details, synced to Firestore per user
- ⏱️ **Screen Time Tracker** — tracks daily in-app usage automatically
- 🌗 **Light/Dark Theme** — persisted theme preference across sessions
- 📱 **Installable PWA** — add to home screen on Android/desktop for an app-like experience
- ☁️ **Real-time Sync** — all user data stored per-account in Cloud Firestore

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 19, React Router 7 |
| Build Tool | Vite 7 |
| Backend / Database | Firebase Authentication, Cloud Firestore |
| Charts | Recharts |
| Styling | CSS (custom theming via Context API) |
| Deployment | Vercel |
| Linting | ESLint |

## 🗂️ Project Structure

```
studyos/
├── public/
├── src/
│   ├── components/     # Reusable UI (Card, Sidebar, ProgressBar, GoalReminder, SaveBadge)
│   ├── pages/           # Route-level pages (Dashboard, Goals, Health, LearningPath, Login, Profile)
│   ├── hooks/           # Custom hooks (useAuth, useUserData)
│   ├── firebase/        # Firebase config & Firestore data access layer
│   ├── ThemeContext.jsx # Light/dark theme provider
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project (free tier is enough) with **Authentication** and **Firestore** enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/Yogeswari-k/studyos.git
cd studyos

# Install dependencies
npm install
```



### Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment

Currently deployed on **Vercel**: [studyos-kappa.vercel.app](https://studyos-kappa.vercel.app)

To deploy your own instance, connect the repo to Vercel and add the same environment variables from your `.env` file in the Vercel project settings.

## 🗺️ Roadmap

- [ ] Push notifications for goal reminders
- [ ] Weekly/monthly progress analytics
- [ ] Offline-first data sync
- [ ] Export data as PDF/CSV

## 🤝 Contributing

This is currently a personal/solo project, but suggestions and issues are welcome — feel free to open an [issue](../../issues) or a pull request.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👩‍💻 Author

**Yogeswari K**
B.Tech CSE, Women's Engineering College, Puducherry

- GitHub: [@Yogeswari-k](https://github.com/Yogeswari-k)

---

<div align="center">
Made with 💛 and a lot of debugging
</div>
