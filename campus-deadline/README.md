# CampusDeadline 🎓⏱️
### Personal & Collaborative Academic Early-Warning System

> **CampusDeadline turns scattered personal and group academic deadlines into one early-warning system that tells students what is coming, what is risky, and what they should do next.**

Built for the **Full Spectrum – Spectra 2026 Group Build Event** by a 4-student collaborative team (seniors leading Build stage, juniors leading User Flow & Design, entire team on Solution, Idea Origin, and Documentation).

---

## 🌟 Core Features & Capabilities

- **Automated Collision Detection:** Detects when multiple high-effort assignments land on the exact same date (e.g. *3 deadlines clustered on 12 Oct: DBMS, Mathematics, Physics*) and flags the bottleneck.
- **Academic Load Radar:** Monitors total estimated effort hours, urgency, and active tasks to provide an early-warning status (**LOW**, **MODERATE**, **HEAVY**).
- **Smart Priority ("What Should I Do First?"):** Multi-factor scoring engine categorizing deliverables into **DO NOW**, **DO NEXT**, and **LATER** to eliminate student decision paralysis.
- **Academic Pressure Meter:** Safe, non-medical visual bars tracking workload concentration across **DAY (24h)**, **WEEK (7d)**, and **MONTH (30d)**.
- **3-Step Rescue Plan:** Emergency operational triage sequence activated when academic load is heavy.
- **Strict On-Time Completion Streaks:** Rewards consistent discipline. Per rulebook specification, late submissions do **not** increase the on-time streak.
- **Study Circle Collaboration:** Synchronized group deliverables with member progress tracking (**Pending**, **Acknowledged**, **Completed**) and discovery via Device Contacts or Unique `@username`.
- **Google Stitch Aesthetics:** Pixel-perfect warm sandstone (`#EDEAE4`), cream cards (`#F8F6F1`), terracotta accent (`#A83515`), and full dark theme support (`data-theme="dark"`).

---

## 📂 Full Spectrum Event Deliverables

This repository is structured around the 6 required stages of the Full Spectrum Rulebook:

1. **Stage 1: Solution** ➔ [`solution.md`](./docs/solution.md)
2. **Stage 2: User Flow** ➔ [`user-flow.md`](./docs/user-flow.md)
3. **Stage 3: Design** ➔ [`src/index.css`](./src/index.css) & Google Stitch UI components
4. **Stage 4: Idea Source** ➔ [`idea-origin.md`](./docs/idea-origin.md)
5. **Stage 5: Build (Working Code)** ➔ Source code in [`src/`](./src/)
6. **Stage 6: Documentation** ➔ [`documentation.md`](./docs/documentation.md)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, production bundle in `dist/` with 0 errors.

### 4. Run Automated Engine Tests
```bash
node test_engine.js
```
Validates date urgency, collision detection clustering, and on-time streak invariant rules.

---

## 🏗️ Architecture & Component Map

```
campus-deadline/
├── docs/                      # Full Spectrum deliverables
├── src/
│   ├── components/
│   │   ├── AddDeadlineModal.jsx       # Deadline creation form
│   │   ├── AddFriendModal.jsx         # Contacts & Username friend discovery
│   │   ├── BottomNav.jsx              # 4-tab navigation (Home, Deadlines, Insights, Friends)
│   │   ├── DeadlineCard.jsx           # Assignment item with progress & quick complete
│   │   ├── DeadlineDetailsModal.jsx   # Deliverable metrics, notes, member status sync
│   │   ├── FilterChips.jsx            # Dynamic pills (ALL, TODAY, THIS WEEK, OVERDUE)
│   │   ├── FriendProfileModal.jsx     # Teammate drawer with shared deliverables
│   │   ├── Header.jsx                 # Top brand bar with streak pill and avatar
│   │   ├── Icons.jsx                  # Clean SVG icon system
│   │   ├── SearchBar.jsx              # Real-time search input
│   │   ├── ShareDeadlineModal.jsx     # Teammate selection dialog
│   │   └── UrgentBanner.jsx           # Immediate Action Horizon card
│   ├── context/
│   │   └── AppContext.jsx             # Centralized reactive state & engines
│   ├── data/
│   │   └── deadlines.js               # Realistic initial semester dataset
│   ├── pages/
│   │   ├── DeadlinesPage.jsx          # Comprehensive tracker & action FAB
│   │   ├── FriendsPage.jsx            # Study circle collaboration & group sync
│   │   ├── HomePage.jsx               # Personal early-warning command center
│   │   ├── InsightsPage.jsx           # Load radar, collisions, pressure, priority
│   │   ├── PriorityPage.jsx           # Alias to InsightsPage
│   │   └── ProfilePage.jsx            # Student records, notifications, theme
│   ├── utils/
│   │   └── dateUtils.js               # Date math, relative horizons, and formatting
│   ├── App.jsx                        # Root layout orchestrator
│   └── index.css                      # Google Stitch design system & dark tokens
├── test_engine.js                     # Automated algorithmic test suite
├── package.json
└── vite.config.js
```

---

## 🎨 Design System Tokens

- **Page Background:** `#EDEAE4` (Warm sandstone)
- **Card Background:** `#F8F6F1` (Cream off-white)
- **Dark Horizon Card:** `#2A2B2C` (Deep charcoal)
- **Terracotta Primary:** `#A83515` (Brand accent, active indicators, progress)
- **Primary Text:** `#161718`
- **Secondary Text:** `#6C6A66`
- **Typography:** Inter, system sans-serif
- **Dark Theme:** Full `[data-theme="dark"]` stylesheet tokens built-in
