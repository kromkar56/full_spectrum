# DEADLINEO — Technical Documentation 📖

**Project:** DEADLINEO (CampusDeadline System)  
**Positioning:** A personal and collaborative academic early-warning system  
**Event:** Full Spectrum – Spectra 2026 Group Build Event  
**Repository Stage:** 6. Documentation (`documentation.md`)  
**Technology Stack:** React 19, Vite 8, Vanilla CSS Design System, LocalStorage Persistence

---

## 1. Project Overview & Architecture

**DEADLINEO** turns scattered personal and group academic deadlines into one early-warning system that tells students what is coming, what is risky, and what they should do next.

### System Architecture
The application is structured around a **Single Source of Truth** using React's Context API (`AppContext.jsx`) with automatic `localStorage` synchronization:

```
campus-deadline/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable presentation and interaction components
│   │   ├── AddDeadlineModal.jsx       # Deadline creation & editing form
│   │   ├── AddFriendModal.jsx         # Contacts & Unique Username discovery
│   │   ├── BottomNav.jsx              # 4-tab persistent navigation bar
│   │   ├── DeadlineCard.jsx           # Deliverable item with progress bar & CTA
│   │   ├── DeadlineDetailsModal.jsx   # Full deliverable details & member sync
│   │   ├── FilterChips.jsx            # Category filter pills with live counters
│   │   ├── FriendProfileModal.jsx     # Teammate profile drawer & shared items
│   │   ├── Header.jsx                 # Top brand bar with streak pill & avatar
│   │   ├── Icons.jsx                  # Clean, lightweight SVG icon system
│   │   ├── SearchBar.jsx              # Real-time search input
│   │   ├── ShareDeadlineModal.jsx     # Teammate sharing dialog
│   │   └── UrgentBanner.jsx           # Immediate Action Horizon urgent progress card
│   ├── context/
│   │   └── AppContext.jsx             # Centralized state, mutations, & algorithms
│   ├── data/
│   │   └── deadlines.js               # Initial realistic semester mock dataset
│   ├── pages/
│   │   ├── DeadlinesPage.jsx          # Searchable, filterable assignment tracker
│   │   ├── FriendsPage.jsx            # Study circle collaboration & group sync
│   │   ├── HomePage.jsx               # Command center overview & What's Next
│   │   ├── InsightsPage.jsx           # Early-warning radar, collisions, & priority
│   │   ├── PriorityPage.jsx           # Direct alias to InsightsPage
│   │   └── ProfilePage.jsx            # Student progress, theme, notifications
│   ├── utils/
│   │   └── dateUtils.js               # Date math, relative horizons, and urgency
│   ├── App.jsx                        # Layout container and modal mount orchestrator
│   ├── index.css                      # Google Stitch design tokens & dark mode
│   └── main.jsx                       # React entry point
├── test_engine.js                     # Automated algorithmic validation suite
├── package.json
└── vite.config.js
```

---

## 2. Core Data Architecture

All state entities are strongly typed, normalized, and managed centrally inside `AppContext`:

```typescript
interface Deadline {
  id: string;                      // Unique ID (e.g., 'dl-1')
  title: string;                   // Deliverable title (e.g. 'DBMS Group Assignment')
  course: string;                  // Subject (e.g., 'DBMS', 'MATHEMATICS')
  courseCode?: string;             // Course code (e.g., 'CS 310')
  type: string;                    // 'Assignment' | 'Exam' | 'Project' | 'Lab' | 'Meeting' | 'Other'
  dueDate: string;                 // ISO date (YYYY-MM-DD)
  dueTime: string;                 // Time string (e.g., '11:59 PM')
  priority: 'low' | 'medium' | 'high'; // Importance tier
  estimatedEffort: number;         // Workload in hours (e.g. 2.0, 3.5)
  progressPercent: number;         // 0 to 100
  isCompleted: boolean;            // Completion flag
  completedAt: string | null;      // Completion timestamp
  completedOnTime: boolean | null; // Strict rulebook on-time boolean
  notes?: string;                  // Specifications and assignment instructions
  sharedWith: Array<{              // Study group teammates
    id: string;
    name: string;
    username: string;
    status: 'Pending' | 'Acknowledged' | 'Completed';
  }>;
}

interface Streaks {
  currentStreak: number;           // Consecutive days completed on time
  bestStreak: number;              // Historic maximum on-time streak
  completedOnTime: number;         // Total submissions submitted before/on deadline
  totalCompleted: number;          // All completions
  lateCompleted: number;           // Completed after deadline
}

interface UserProfile {
  name: string;
  username: string;
  role: string;
  email: string;
  avatar: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    deadlineReminders: boolean;
    sharedUpdates: boolean;
    streakReminders: boolean;
  };
  privacy: {
    personalDeadlinesPrivate: boolean;
    sharedVisibleToTeammates: boolean;
  };
}
```

---

## 3. Algorithmic Deep Dives: Business Logic & Reasoning

### Algorithm 1: Deadline Collision Detection
- **WHAT:** Scans all active, non-completed deliverables and groups them by `dueDate`. Identifies any calendar date containing $\ge 2$ deliverables as a **Collision Cluster**.
- **WHY:** Single-assignment deadlines are manageable, but simultaneous deadlines cause catastrophic time bottlenecks. Detecting collisions in advance allows the student to mitigate risk before the deadline crunch.
- **Code Reference (`AppContext.jsx`):**
  ```javascript
  const dateGroups = {};
  pending.forEach((d) => {
    if (!dateGroups[d.dueDate]) dateGroups[d.dueDate] = [];
    dateGroups[d.dueDate].push(d);
  });
  const clusters = Object.entries(dateGroups)
    .filter(([_, items]) => items.length >= 2)
    .map(([date, items]) => ({
      date,
      formattedDate: formatDateDisplay(date),
      count: items.length,
      deadlines: items
    }));
  ```

### Algorithm 2: Academic Load Radar
- **WHAT:** Synthesizes active pending count, cumulative estimated effort hours, urgency factor, and active collision states into a clear status tier: **LOW**, **MODERATE**, or **HEAVY**.
- **WHY:** Raw task counts can be deceptive (five 15-minute quizzes vs. one 15-hour research project). Weighting by estimated effort gives an honest, holistic radar of upcoming academic load.
- **Classification Rules:**
  - **HEAVY:** $\ge 5$ pending tasks OR $\ge 10\text{h}$ effort OR ($\ge 2$ urgent tasks with active collisions).
  - **MODERATE:** $\ge 3$ pending tasks OR $\ge 5\text{h}$ effort OR $\ge 1$ urgent task.
  - **LOW:** Workload is well balanced ($\le 2$ tasks, $< 5\text{h}$ effort).

### Algorithm 3: Academic Pressure Meter
- **WHAT:** Visualizes deadline and effort concentration across three discrete time horizons:
  1. **DAY:** Deliverables due within the next 24 hours.
  2. **WEEK:** Deliverables due within the next 7 days.
  3. **MONTH:** Deliverables due within the next 30 days.
- **WHY:** Answers the student's primary forward-looking question: *"When will I be busiest?"*
- **Ethical Language Rule:** Uses non-medical terms like **Academic Pressure**, **Heavy Workload**, and **Deadline Concentration**. Strictly avoids psychological or clinical burnout terminology.

### Algorithm 4: Smart Priority Multi-Factor Engine ("What Should I Do First?")
- **WHAT:** Calculates an objective priority score for every pending deliverable and groups them into three operational action tiers:
  - **DO NOW:** Highest score items ($\ge 85$ or due within 24h).
  - **DO NEXT:** Approaching assignments (scores 50–84, due within 2–4 days).
  - **LATER:** Distant horizon assignments.
- **Scoring Weights:**
  - **Urgency Weight:** Overdue ($+100$), Due Today ($+80$), Due Tomorrow ($+60$), Due $\le 3\text{d}$ ($+40$), Due $\le 7\text{d}$ ($+20$).
  - **Priority Tag Weight:** High ($+25$), Medium ($+15$), Low ($+5$).
  - **Effort Penalty:** Larger assignments due soon get elevated priority early: $\min(\text{effort} \times 4, 20)$.
  - **Collision Risk Factor:** If the assignment falls on a clustered collision date, it receives a $+15$ boost to defuse the logjam early.
- **WHY:** Prevents decision paralysis. Students don't have to guess what to tackle first.

### Algorithm 5: 3-Step Rescue Plan
- **WHAT:** Provides a sequential, 3-step triage roadmap when academic workload is **HEAVY**:
  - **Step 1 (DO NOW):** Finish the single most imminent high-impact assignment.
  - **Step 2 (DO NEXT):** Prepare materials for the next approaching deliverable to stop tomorrow's bottleneck.
  - **Step 3 (PREPARE LATER):** Outline and stage distant assignments.
- **WHY:** Reuses Smart Priority logic to provide an immediate crisis triage plan without complex separate subsystems.

### Algorithm 6: On-Time Streak Rulebook Engine
- **WHAT:** Tracks consecutive days with on-time completions, total submissions, and late completions.
- **RULEBOOK REQUIREMENT:**
  > *"A task counts toward the ON-TIME STREAK only if completed before its deadline. Late completion must NOT increase the on-time streak."*
- **Implementation Logic (`AppContext.jsx`):**
  ```javascript
  const diffDays = getDaysDifference(deadline.dueDate);
  const isOnTime = diffDays >= 0; // Completed on or before due date

  if (isOnTime) {
    const newStreak = streaks.currentStreak + 1;
    setStreaks({
      ...streaks,
      currentStreak: newStreak,
      bestStreak: Math.max(streaks.bestStreak, newStreak),
      completedOnTime: streaks.completedOnTime + 1,
      totalCompleted: streaks.totalCompleted + 1,
    });
  } else {
    // Late completion increments total and late, but NEVER on-time streak
    setStreaks({
      ...streaks,
      lateCompleted: streaks.lateCompleted + 1,
      totalCompleted: streaks.totalCompleted + 1,
    });
  }
  ```

### Algorithm 7: Study Circle Teammates & Shared Synchronization
- **WHAT:** Facilitates collaborative group project management.
- **Synchronization Rules:**
  - When an authorized member edits a shared deadline (e.g. adjusts date from 12 Oct to 14 Oct), the change automatically propagates to all study group members.
  - Each teammate has an individual status (**Pending**, **Acknowledged**, **Completed**) that can be updated with one click.
  - Personal assignments remain strictly private.

---

## 4. How to Run the Application

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm

### Step 1: Navigate to Project Directory
```bash
cd campus-deadline
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Step 4: Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory with zero build errors.

### Step 5: Execute Automated Engine Tests
```bash
node test_engine.js
```
Runs the automated verification suite covering date urgency, collision detection, and on-time streak invariants.

---

## 5. Scope Control & Known Limitations

Given the 4-hour hackathon build scope:
1. **Network Persistence:** Data is currently synchronized in browser `localStorage`. Real-world multi-user synchronization would connect to a lightweight WebSocket or Firestore backend.
2. **Contact Access:** Contact integration is simulated through an interactive mock permission flow that demonstrates full fallback to the unique username search.
3. **Push Notifications:** Notification preferences are stored and managed via interactive switches; actual browser Web Push APIs would be wired in a production release.

---

## 6. Team Judging & Q&A Defense Guide

During judging, any team member (seniors or juniors) may be questioned. Use these concise answers:

- **Q: "Why did you choose this over Google Calendar or Notion?"**  
  *A: "Calendars and Notion are passive lists. They don't detect when 3 assignments collide on the same date, nor do they factor estimated effort into answering 'What should I do first?'. CampusDeadline is an active early-warning system, not a passive calendar."*

- **Q: "How does the Collision Detection algorithm work?"**  
  *A: "It groups all active pending deadlines by their due date. If any calendar date has 2 or more deliverables, it flags that date as a collision cluster, shows a warning on Home, and adds a risk weight to Smart Priority so the student begins early."*

- **Q: "How is the On-Time Streak calculated?"**  
  *A: "We strictly follow the rulebook: when a student marks an assignment complete, we compare the completion date to the deadline. If it was completed on or before the due date, the on-time streak increments. If it was completed late, it is recorded as a late completion, and the on-time streak does NOT increase."*

- **Q: "How did your 4-student team divide the work?"**  
  *A: "Our juniors led User Flow, Wireframing, and the Google Stitch design system. Our seniors led the Build phase, Context architecture, and algorithm implementation. The whole team participated in the Solution pitch, Idea Source, and Documentation."*
