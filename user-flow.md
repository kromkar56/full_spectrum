# CampusDeadline — User Flow Document 🗺️

**Event:** Full Spectrum – Spectra 2026 Group Build Event  
**Project:** CampusDeadline  
**Track:** Student Productivity & Collaborative Systems  
**Leadership:** Juniors Led User Flow & Design Architecture  
**Repository Stage:** 2. User Flow (`user-flow.md`)

---

## 1. Complete Core Application Journey

The primary end-to-end user journey mandated by the Full Spectrum Rulebook:

```
[ OPEN APPLICATION ]
        │
        ▼
[ DEMO LOGIN PAGE ] ──────────► Zero-Friction Presentation Sign-In
        │                      ► 1-Click Persona Access (Shivam, Riya, Evaluator)
        │                      ► Form Sign In with Any Campus Email
        ▼
   [ HOME SCREEN ] ────► View Greeting ("Good morning, Shivam")
        │          ────► View Academic Load Status (LOW / MODERATE / HEAVY)
        │          ────► Review Collision Alert Banner (if dates cluster)
        ▼
[ MOST IMPORTANT DEADLINE ] ───► Check Proximity, Due Time, and Effort
        │
        ▼
[ "WHAT'S NEXT" LIST ] ────────► Review Ranked Top 4 Upcoming Deliverables
        │
        ▼
[ ADD / OPEN DEADLINE ] ───────► Tap Top Card, List Item, or Quick Add (+)
        │
        ▼
[ DEADLINE DETAILS ] ──────────► View Full Metrics, Effort, Notes, & Teammates
        │
        ▼
[ SMART PRIORITY ] ────────────► "What Should I Do First?" (DO NOW / DO NEXT / LATER)
        │
        ▼
[ ACADEMIC LOAD RADAR ] ───────► Examine Effort Hours & Pending Volume
        │
        ▼
[ COLLISION DETECTION ] ───────► Identify Date Clusters (e.g. "3 deadlines on 12 Oct")
        │
        ▼
[ ACADEMIC PRESSURE METER ] ───► Evaluate Workload Across DAY, WEEK, MONTH
        │
        ▼
[ RESCUE PLAN (IF HEAVY) ] ────► Follow 3-Step Action Triage Roadmap
        │
        ▼
[ COMPLETE DELIVERABLE ] ──────► Tap "Mark Complete" / Submit Workspace
        │
        ▼
[ STATE PROPAGATION ] ─────────► Streak Incremented (if on-time)
        │                      ► Academic Load & Pressure Recalculated
        │                      ► What's Next & Priority Re-ranked
        ▼
[ STUDY CIRCLE COLLABORATION ] ► Share with Teammates (Contacts or Username)
                               ► Synchronize Due Dates & Member Statuses
```

---

## 2. Interactive Flow Chart (Mermaid Diagram)

```mermaid
flowchart TD
    Start([Launch CampusDeadline]) --> Home[Home Dashboard]
    
    Home -->|Inspect Status| LoadBadge[Academic Load Radar: Low / Moderate / Heavy]
    Home -->|Impending Bottleneck| CollisionBanner[Collision Alert: Clustered Dates]
    Home -->|Top Action| UrgentCard[Next Important Deadline Card]
    Home -->|Ranked Overview| WhatsNext[What's Next Checklist]
    Home -->|Floating FAB / Button| AddModal[Add Deadline Modal]
    
    UrgentCard --> DetailsModal[Deadline Details Modal]
    WhatsNext --> DetailsModal
    
    DetailsModal -->|Action: Mark Complete| CompleteAction{Submitted On-Time?}
    CompleteAction -->|Yes| StreakIncrement[Increment On-Time Streak + Update Streaks Record]
    CompleteAction -->|No (Late)| StreakHold[Record Late Submission - Streak Does Not Increase]
    StreakIncrement --> StateUpdate[Centralized State Recalculation]
    StreakHold --> StateUpdate
    
    DetailsModal -->|Action: Edit| EditModal[Edit Form Modal]
    DetailsModal -->|Action: Delete| DeleteConfirm[Confirmation Dialog]
    DetailsModal -->|Action: Share| ShareModal[Share Teammates Modal]
    
    StateUpdate --> Home
    StateUpdate --> Deadlines[Deadlines Tracker Page]
    StateUpdate --> Insights[Insights Intelligence Page]
    
    Insights --> RadarView[Academic Load Breakdown]
    Insights --> CollisionView[Collision Cluster Detail]
    Insights --> PressureView[Academic Pressure Meter: Day / Week / Month]
    Insights --> PriorityView[Smart Priority: DO NOW / DO NEXT / LATER]
    Insights --> RescueView[Rescue Plan: 3-Step Triage Plan]
    
    BottomNav[Bottom Navigation Bar] --> Home
    BottomNav --> Deadlines
    BottomNav --> Insights
    BottomNav --> Friends[Friends & Teammates Page]
    
    HeaderAvatar[Top Avatar Button] --> Profile[Profile & Preferences Page]
    
    Friends --> AddFriend[Add Friend Modal: Contacts vs Username]
    Friends --> SharedView[Shared Deadlines with Sync]
    Friends --> Requests[Accept / Decline Friend Requests]
```

---

## 3. Screen-by-Screen User Journey Breakdown

### Step 1: Home Dashboard
- **Visual Focus:** Generous whitespace with prominent warm sandstone background and terracotta accents.
- **Immediate Feedback:**
  - Personalized greeting: `"Good morning, Shivam"`.
  - Academic Load status pill: Displays `"LOW"`, `"MODERATE"`, or `"HEAVY"` with immediate explanation.
  - If 2 or more deadlines share the same due date, an interactive amber **Collision Alert Banner** appears: `"3 deadlines are clustered on 12 Oct"`.
  - **Most Important Upcoming Deadline:** Prominent card detailing the title, course, due timestamp, estimated effort, and one-tap completion.
  - **What's Next:** Ranked 1-4 deliverables for immediate focus.

### Step 2: Deadline Exploration & Filtering (Deadlines Page)
- Accessible via the persistent bottom navigation bar.
- **Immediate Action Horizon Banner:** Replicates the Google Stitch dark-card urgent alert showing count of deliverables due within 24h and on-track percentage.
- **Reactive Search:** Instant filtering across deliverable titles, course names (`DBMS`, `MATHEMATICS`), and course codes (`CS 310`, `MATH 302`).
- **Dynamic Filter Chips:** Instant toggle between `ALL`, `TODAY`, `THIS WEEK`, `OVERDUE`, and `COMPLETED` with live counter badges.
- **Sorting Toggle:** One-tap sort toggle switching between urgency-based ordering and effort-based ordering.
- **Floating Action Button (FAB):** Persistent terracotta `+` button in the lower right for instant deadline logging.

### Step 3: Add & Edit Deliverable Modal
- Triggered from the Home button, Deadlines FAB, or Details edit button.
- **Input Fields:**
  - Deliverable Title (required).
  - Course / Subject and optional Course Code.
  - Type Selector (`Assignment`, `Exam`, `Project`, `Lab`, `Meeting`, `Other`).
  - Due Date & Due Time picker.
  - Priority Level selector pills (`Low`, `Medium`, `High`).
  - Estimated Effort (in hours, e.g. 2.0h, 3.5h)—critical input for Smart Priority and Load calculations.
  - Optional Study Group Teammates selector chips.
  - Specifications / Notes text area.
- **On Submit:** State engine instantly updates, closes modal, and recalculates all views without page reloads.

### Step 4: Deadline Details & Lifecycle Management
- Opens upon tapping any deliverable card or ranked list item.
- **Presented Information:**
  - Full title, subject pill, and urgency badge.
  - Priority badge and estimated effort badge.
  - Inset card displaying due date, due time, workload impact, and current status.
  - Interactive progress indicator.
  - Deadline collision warning if the assignment coincides with other deliverables on the same date.
  - **Shared Teammates Section:** Lists study group members with individual status pills (**Pending**, **Acknowledged**, **Completed**). Tapping any status pill cycles its state.
- **Actions:**
  - `Mark Completed on Time` / `Reopen Deadline`.
  - `Edit` (opens pre-filled edit form).
  - `Delete` (opens a safety confirmation modal to prevent accidental data loss).
  - `Share with Friends` (opens teammate selector).

### Step 5: Academic Insights & Smart Priority
- Accessible via bottom nav `#nav-insights`.
- **Academic Load Radar:** Full quantitative breakdown of active tasks, estimated effort hours, and immediate deadlines.
- **Deadline Collision Detection:** Outlines all clustered dates, identifies conflicting subjects, and recommends spacing effort early.
- **Academic Pressure Meter:** Non-medical visual bars evaluating deadline concentration across **DAY (24h)**, **WEEK (7d)**, and **MONTH (30d)**.
- **Consistency Streaks:** Current on-time streak, best streak, on-time completions, total completions, and late completions.
- **Sub-Tab 1: Smart Priority ("What Should I Do First?"):**
  - **DO NOW:** Highest priority deliverables requiring immediate triage.
  - **DO NEXT:** Secondary deliverables approaching in 2-4 days.
  - **LATER:** Distant horizon assignments.
  - Selecting any item opens its full Details view.
- **Sub-Tab 2: Rescue Plan (3-Step Triage):**
  - **STEP 1 (DO NOW):** Finish highest impact deliverable.
  - **STEP 2 (DO NEXT):** Prepare the subsequent deliverable.
  - **STEP 3 (PREPARE LATER):** Stage and outline remaining tasks.

### Step 6: Friends & Study Group Collaboration
- Accessible via bottom nav `#nav-friends`.
- **Academic Collaboration Only:** No social feeds, no likes, no comments, no chat spam.
- **Add Teammates Modal:**
  - **Option 1 (Contacts):** Requests mock contact access permission; enables searching address book with `Add`, `Pending`, and `Friends` status buttons.
  - **Option 2 (Unique Username):** Direct lookup by `@username` handle with instant validation and user profile discovery.
- **Friend Requests:** Incoming teammate requests with `Accept` and `Decline` actions.
- **Shared Deliverables Section:** Synchronized group assignments with teammate status badges.
- **Study Circle List:** Displays classmates with active online indicators and shared deliverable counts. Tapping any friend opens their profile drawer with options to view shared assignments or remove teammate.

### Step 7: Profile & Application Preferences
- Accessible by tapping the user avatar in the top brand header.
- **Student Identity:** Name (`Shivam Sharma`), student handle (`@shivam_s`), and academic role (`CS Undergrad · Year 3`).
- **On-Time Completion Record:** 3-box progress summary showing On-Time Streak, Completed on Time, and Total Completed.
- **Notifications:** Simple ON/OFF toggle switches for Deadline Reminders, Shared Updates, and Streak Reminders.
- **Appearance Theme:** Direct selection between **Light**, **Dark**, and **System** themes. Changes apply instantly to CSS custom properties across all screens.
- **Privacy Safeguards:** Clear visual explanation that personal deadlines are **PRIVATE** and group deliverables are accessible strictly to invited teammates.
- **Account Actions:** Change Password modal and Log Out confirmation dialog.

---

## 4. State Synchronization Matrix

| User Trigger Action | State Updates Triggered | Screens Reacting Immediately |
| :--- | :--- | :--- |
| **Add New Deadline** | Appends deadline object, recalculates urgency | Home, Deadlines, Insights, Collisions, Smart Priority |
| **Edit Existing Deadline** (e.g. change due date from 12 Oct to 14 Oct) | Modifies deadline date, recalculates collisions and load | Home, Deadlines, Insights, Shared Deadlines in Friends |
| **Mark Task Completed** (On-Time) | Sets `isCompleted=true`, increments `completedOnTime` and `currentStreak` | Home (clears from What's Next), Deadlines, Streaks, Workload Radar |
| **Mark Task Completed** (Late) | Sets `isCompleted=true`, increments `lateCompleted`, **on-time streak does NOT increase** | Home, Deadlines, Insights, Profile Record |
| **Share Deliverable with Teammate** | Appends teammate to `sharedWith` with `Pending` status | Deadline Details, Friends Page (Shared Deliverables) |
| **Cycle Teammate Status** (`Pending` → `Acknowledged` → `Completed`) | Updates member status in shared deadline | Deadline Details, Friends Page (Shared Deliverables) |
| **Accept Friend Request** | Moves requester from `friendRequests` to `friends` | Friends Page (clears request, adds friend card) |
| **Toggle Dark/Light Theme** | Updates `user.theme`, sets `data-theme` attribute on document root | Entire application layout, cards, and navigation |

---

## 5. Empty States & Error Mitigation

- **No Deadlines in Filter:** Clean illustration card with title, explanatory text, and `+ Add your first deadline` CTA button.
- **No Teammates Added:** Informative card with `+ Add a teammate` CTA directing to Contacts or Username flow.
- **No Shared Deliverables:** Subdued notice explaining how to share deliverables from the Deadline Details view.
- **Denied Contact Access:** Shows graceful fallback card allowing the user to either grant permission or effortlessly use Option 2 (Add by Unique Username).
