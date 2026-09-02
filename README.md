# 🌌 NextGen AR/VR — College Tech Club & E-Sports Portal

A modern, full-stack web portal for **NextGen AR/VR**, a college tech club focused on Virtual Reality (VR), Augmented Reality (AR), Spatial Computing, Unreal Engine Game Development, and Collegiate E-Sports Tournaments.

---

## ✨ Features

### 🚀 Public-Facing Experience
- **Interactive Hologram Hero**: 3D wireframe constellation canvas with mouse-follow parallax.
- **Home**: Live club counters, dynamic announcements, event countdown clock, 6 domain wings, and hardware VR lab showcase.
- **About**: Club story, faculty coordinator spotlight, leadership board, and interactive milestone timeline.
- **Join the Club**: Live recruitment status toggle (Open/Closed), multi-domain specialization selection, validated application form with instant tracking code.
- **Events Calendar**: Filterable by Workshops, Hackathons, E-Sports, live seat counters, event details modal, and solo/team registration.
- **Members Directory**: Search and filter by domain (AR/VR, Game Dev, AI, 3D Design, Esports) and batch.
- **E-Sports Hub**: Dedicated gaming sub-portal, **Interactive Points Calculator Simulator** (Battle Royale 15-pt scale & Tactical 5v5 modes), Top-3 podium, and full tournament standings table.
- **Session Feedback**: 3-tier 5-star interactive rating widgets (Content, Organization, Speaker) and qualitative comments.
- **Contact & FAQs**: Direct inquiry form, campus VR Lab details, socials, and interactive FAQ accordion.

### 🔒 Access-Restricted Admin Panel (`/admin/*`)
- **Protected by JWT Authentication & Bcrypt Password Hashing**.
- **Dashboard**: Metrics overview, quick actions, pending applicants queue, and audit trail.
- **Members Management**: 1-click **Approve/Reject** (*approving automatically converts applicants into active members in the directory!*), member CRUD, and **Export CSV**.
- **Events Management**: Event creator/editor with real-time **Registration Open/Closed toggle**, attendee viewer, and **Export Registrants CSV**.
- **E-Sports Operations**: Tournament creator, scoring rules configurator, squad registration, and match results entry (*auto-calculates tournament points & updates live leaderboard*).
- **Feedback Management**: Filter feedback by event, view aggregate star ratings, and **Export Feedback CSV**.
- **Site CMS & Settings**: Dynamic switch for **Recruitment Open/Closed status**, announcement ribbon editor, club stats counters, and admin password changer.

---

## 🔑 Default Admin Credentials

- **Admin Login Route**: `/admin/login`
- **Email**: `admin@nextgenarvr.club`
- **Password**: `Admin@NextGen2026!`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Lucide Icons, Canvas Confetti, Custom Vanilla CSS Glassmorphic Cyber Design System.
- **Backend**: Node.js, Express.js REST API, JSON-backed relational database engine with initial seed data.
- **Authentication**: JWT (JSON Web Tokens) with 24-hour expiration, Bcrypt password hashing.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Git](https://git-scm.com/)

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nextgen-arvr-portal.git

# Navigate into the project folder
cd nextgen-arvr-portal

# Install dependencies
npm install

# Build the frontend bundle
npm run build

# Start the full-stack server
npm start
```

Open `http://localhost:5000` in your browser.

---

## 🧪 Running Automated Tests

```bash
node test_e2e.mjs
```

---

## 📄 License
MIT License. Built for the NextGen AR/VR Tech Community.
