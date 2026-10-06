import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_DEADLINES,
  INITIAL_FRIENDS,
  INITIAL_CONTACTS,
  INITIAL_REQUESTS,
  INITIAL_USER,
  INITIAL_STREAKS
} from '../data/deadlines';
import { getDaysDifference, getDeadlineUrgency, formatDateDisplay } from '../utils/dateUtils';

const AppContext = createContext();

const STORAGE_KEYS = {
  DEADLINES: 'campus_deadlines_v1',
  FRIENDS: 'campus_friends_v1',
  CONTACTS: 'campus_contacts_v1',
  REQUESTS: 'campus_requests_v1',
  USER: 'campus_user_v1',
  STREAKS: 'campus_streaks_v1',
  AUTH: 'campus_auth_v1',
};

export function AppProvider({ children }) {
  // --- Persistent State Initialization ---
  const [deadlines, setDeadlines] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEADLINES);
    return saved ? JSON.parse(saved) : INITIAL_DEADLINES;
  });

  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [friendRequests, setFriendRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [streaks, setStreaks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STREAKS);
    return saved ? JSON.parse(saved) : INITIAL_STREAKS;
  });

  // --- Demo Authentication State ---
  // Presentation demo mode: allows quick sign in & sign out without backend friction
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === null ? false : saved === 'true';
  });

  // --- UI Navigation & Modal State ---
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'deadlines' | 'insights' | 'friends' | 'profile'
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showRescuePlanModal, setShowRescuePlanModal] = useState(false);

  // Sync auth state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEADLINES, JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    // Apply theme attribute to document
    if (user.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
  }, [streaks]);

  // =========================================================================
  // CORE BUSINESS LOGIC & ENGINES (Clean & Explainable for Judging Q&A)
  // =========================================================================

  /**
   * 1. DEADLINE COLLISION DETECTION
   * WHAT: Detects calendar dates where multiple pending deliverables cluster together.
   * WHY: Alerts students to dangerous bottleneck days before they cause missed submissions.
   */
  const collisionData = useMemo(() => {
    const pending = deadlines.filter((d) => !d.isCompleted);
    const dateGroups = {};

    pending.forEach((d) => {
      if (!d.dueDate) return;
      if (!dateGroups[d.dueDate]) {
        dateGroups[d.dueDate] = [];
      }
      dateGroups[d.dueDate].push(d);
    });

    const clusters = Object.entries(dateGroups)
      .filter(([_, items]) => items.length >= 2)
      .map(([date, items]) => ({
        date,
        formattedDate: formatDateDisplay(date),
        count: items.length,
        deadlines: items,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      hasCollision: clusters.length > 0,
      clusters,
      primaryCollision: clusters[0] || null,
    };
  }, [deadlines]);

  /**
   * 2. ACADEMIC LOAD RADAR
   * WHAT: Combines pending count, total estimated effort hours, urgency, and collisions.
   * WHY: Gives students an immediate early-warning status: LOW, MODERATE, or HEAVY.
   */
  const academicLoad = useMemo(() => {
    const pending = deadlines.filter((d) => !d.isCompleted);
    const totalHours = pending.reduce((sum, d) => sum + (Number(d.estimatedEffort) || 2), 0);

    const urgentCount = pending.filter((d) => {
      const diff = getDaysDifference(d.dueDate);
      return diff <= 1; // Due today or overdue
    }).length;

    let level = 'LOW';
    let explanation = 'Your academic schedule is manageable. Great time to get ahead.';

    if (pending.length >= 5 || totalHours >= 10 || (urgentCount >= 2 && collisionData.hasCollision)) {
      level = 'HEAVY';
      explanation = 'High concentration of deliverables detected. Prioritize immediate action.';
    } else if (pending.length >= 3 || totalHours >= 5 || urgentCount >= 1) {
      level = 'MODERATE';
      explanation = 'Steady pace required. Multiple deliverables approaching this week.';
    }

    return {
      level,
      explanation,
      pendingCount: pending.length,
      totalHours: Number(totalHours.toFixed(1)),
      urgentCount,
    };
  }, [deadlines, collisionData]);

  /**
   * 3. ACADEMIC PRESSURE / BURNOUT METER
   * WHAT: Evaluates workload concentration across DAY, WEEK, and MONTH.
   * WHY: Answers "When will I be busiest?" using strictly safe academic terms.
   */
  const academicPressure = useMemo(() => {
    const pending = deadlines.filter((d) => !d.isCompleted);

    let dayEffort = 0, dayCount = 0;
    let weekEffort = 0, weekCount = 0;
    let monthEffort = 0, monthCount = 0;

    pending.forEach((d) => {
      const diff = getDaysDifference(d.dueDate);
      const effort = Number(d.estimatedEffort) || 2;

      if (diff <= 1) {
        dayCount++;
        dayEffort += effort;
      }
      if (diff <= 7) {
        weekCount++;
        weekEffort += effort;
      }
      if (diff <= 30) {
        monthCount++;
        monthEffort += effort;
      }
    });

    const getIntensity = (hours, count) => {
      if (count >= 3 || hours >= 7) return { label: 'High academic pressure', level: 'high', score: 85 };
      if (count >= 2 || hours >= 4) return { label: 'Moderate workload', level: 'moderate', score: 55 };
      return { label: 'Low pressure', level: 'low', score: 25 };
    };

    return {
      day: { ...getIntensity(dayEffort, dayCount), count: dayCount, hours: dayEffort },
      week: { ...getIntensity(weekEffort, weekCount), count: weekCount, hours: weekEffort },
      month: { ...getIntensity(monthEffort, monthCount), count: monthCount, hours: monthEffort },
    };
  }, [deadlines]);

  /**
   * 4. SMART PRIORITY ENGINE ("WHAT SHOULD I DO FIRST?")
   * WHAT: Scores every pending task on urgency, effort, priority tag, and collision risks.
   * WHY: Directly categorizes tasks into DO NOW, DO NEXT, and LATER to eliminate decision paralysis.
   */
  const smartPriority = useMemo(() => {
    const pending = deadlines.filter((d) => !d.isCompleted);

    const scored = pending.map((d) => {
      let score = 0;
      const diff = getDaysDifference(d.dueDate);
      const effort = Number(d.estimatedEffort) || 2;

      // Urgency factor
      if (diff < 0) score += 100; // Overdue
      else if (diff === 0) score += 80; // Today
      else if (diff === 1) score += 60; // Tomorrow
      else if (diff <= 3) score += 40;
      else if (diff <= 7) score += 20;
      else score += 5;

      // Priority factor
      if (d.priority === 'high') score += 25;
      else if (d.priority === 'medium') score += 15;
      else score += 5;

      // Effort factor (larger tasks due soon get earlier priority)
      if (diff <= 3) {
        score += Math.min(effort * 4, 20);
      }

      // Collision factor
      const isClustered = collisionData.clusters.some((c) => c.date === d.dueDate);
      if (isClustered) score += 15;

      return { ...d, score, diffDays: diff };
    });

    scored.sort((a, b) => b.score - a.score);

    const doNow = [];
    const doNext = [];
    const later = [];

    scored.forEach((item, index) => {
      if (index < 2 || item.diffDays <= 0 || item.score >= 85) {
        doNow.push(item);
      } else if (index < 5 || item.diffDays <= 3 || item.score >= 50) {
        doNext.push(item);
      } else {
        later.push(item);
      }
    });

    return {
      allRanked: scored,
      doNow,
      doNext,
      later,
    };
  }, [deadlines, collisionData]);

  /**
   * 5. RESCUE PLAN GENERATOR
   * WHAT: 3-step action triage reusing Smart Priority.
   * WHY: Offers immediate crisis plan when workload is heavy.
   */
  const rescuePlan = useMemo(() => {
    const { doNow, doNext, later } = smartPriority;

    const step1 = doNow[0] || null;
    const step2 = doNow[1] || doNext[0] || null;
    const step3 = doNext[1] || later[0] || null;

    return {
      step1: step1 ? { title: `Finish ${step1.title}`, task: step1 } : null,
      step2: step2 ? { title: `Prepare ${step2.title}`, task: step2 } : null,
      step3: step3 ? { title: `Outline ${step3.title}`, task: step3 } : null,
      isNeeded: academicLoad.level === 'HEAVY',
    };
  }, [smartPriority, academicLoad]);

  // =========================================================================
  // MUTATIONS & STATE UPDATES (Single Source of Truth)
  // =========================================================================

  /**
   * Add a new deadline
   */
  const addDeadline = (newDeadline) => {
    const id = `dl-${Date.now()}`;
    const deadlineObj = {
      ...newDeadline,
      id,
      isCompleted: false,
      completedAt: null,
      completedOnTime: null,
      progressPercent: newDeadline.progressPercent || 0,
      sharedWith: newDeadline.sharedWith || [],
    };

    setDeadlines((prev) => [deadlineObj, ...prev]);
    return id;
  };

  /**
   * Update an existing deadline (Personal and Shared synchronization)
   */
  const updateDeadline = (id, updates) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );

    if (selectedDeadline && selectedDeadline.id === id) {
      setSelectedDeadline((prev) => ({ ...prev, ...updates }));
    }
  };

  /**
   * Delete a deadline
   */
  const deleteDeadline = (id) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
    if (selectedDeadline && selectedDeadline.id === id) {
      setSelectedDeadline(null);
    }
  };

  /**
   * Toggle task completion and update On-Time Streak
   * RULEBOOK REQUIREMENT:
   * Only on-time completions increase the on-time streak.
   * Late completions do NOT increase the on-time streak.
   */
  const toggleCompleteDeadline = (id) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        const nextCompleted = !d.isCompleted;

        if (nextCompleted) {
          const diffDays = getDaysDifference(d.dueDate);
          const isOnTime = diffDays >= 0; // completed on or before due date

          setStreaks((s) => {
            const newTotal = s.totalCompleted + 1;
            if (isOnTime) {
              const newCurrent = s.currentStreak + 1;
              return {
                ...s,
                currentStreak: newCurrent,
                bestStreak: Math.max(s.bestStreak, newCurrent),
                completedOnTime: s.completedOnTime + 1,
                totalCompleted: newTotal,
              };
            } else {
              // Late completion does not increase on-time streak
              return {
                ...s,
                lateCompleted: s.lateCompleted + 1,
                totalCompleted: newTotal,
              };
            }
          });

          return {
            ...d,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            completedOnTime: isOnTime,
            progressPercent: 100,
          };
        } else {
          // Reopening task
          return {
            ...d,
            isCompleted: false,
            completedAt: null,
            completedOnTime: null,
            progressPercent: 50,
          };
        }
      })
    );

    // Refresh selected deadline view if currently open
    setSelectedDeadline((prev) => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          isCompleted: !prev.isCompleted,
          progressPercent: !prev.isCompleted ? 100 : 50,
        };
      }
      return prev;
    });
  };

  /**
   * Share deadline with teammates
   */
  const shareDeadlineWithFriends = (deadlineId, friendList) => {
    const formattedMembers = friendList.map((f) => ({
      id: f.id,
      name: f.name,
      username: f.username,
      status: 'Pending',
    }));

    updateDeadline(deadlineId, { sharedWith: formattedMembers });
  };

  /**
   * Update teammate status for a shared deliverable (Pending -> Acknowledged -> Completed)
   */
  const updateMemberStatus = (deadlineId, username, newStatus) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id !== deadlineId) return d;
        const updatedShared = (d.sharedWith || []).map((m) =>
          m.username === username ? { ...m, status: newStatus } : m
        );
        return { ...d, sharedWith: updatedShared };
      })
    );

    setSelectedDeadline((prev) => {
      if (prev && prev.id === deadlineId) {
        const updatedShared = (prev.sharedWith || []).map((m) =>
          m.username === username ? { ...m, status: newStatus } : m
        );
        return { ...prev, sharedWith: updatedShared };
      }
      return prev;
    });
  };

  // --- Friends Actions ---
  const addFriend = (newFriend) => {
    setFriends((prev) => [...prev, newFriend]);
  };

  const removeFriend = (friendId) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    if (selectedFriend && selectedFriend.id === friendId) {
      setSelectedFriend(null);
    }
  };

  const acceptFriendRequest = (requestId) => {
    const req = friendRequests.find((r) => r.id === requestId);
    if (!req) return;

    const newFriend = {
      id: `f-${Date.now()}`,
      name: req.from.name,
      username: req.from.username,
      avatar: req.from.avatar || req.from.name.charAt(0),
      online: true,
      sharedCount: 0,
      completedCount: 5,
      pendingCount: 1,
      role: req.from.role || 'Student',
    };

    setFriends((prev) => [...prev, newFriend]);
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const declineFriendRequest = (requestId) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const sendFriendRequest = (targetUsername) => {
    // Optimistic mock request simulation
    setContacts((prev) =>
      prev.map((c) => (c.username === targetUsername ? { ...c, status: 'pending' } : c))
    );
  };

  // --- User Profile Actions ---
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const setTheme = (theme) => {
    setUser((prev) => ({ ...prev, theme }));
  };

  const toggleNotification = (key) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const value = {
    // State
    deadlines,
    friends,
    contacts,
    friendRequests,
    user,
    streaks,
    activeTab,
    selectedDeadline,
    isAddDeadlineOpen,
    editingDeadline,
    isShareModalOpen,
    isAddFriendOpen,
    selectedFriend,
    showRescuePlanModal,

    // Setters / Modals
    setActiveTab,
    setSelectedDeadline,
    setIsAddDeadlineOpen,
    setEditingDeadline,
    setIsShareModalOpen,
    setIsAddFriendOpen,
    setSelectedFriend,
    setShowRescuePlanModal,

    // Computed Intelligence Engines
    collisionData,
    academicLoad,
    academicPressure,
    smartPriority,
    rescuePlan,

    // Actions
    addDeadline,
    updateDeadline,
    deleteDeadline,
    toggleCompleteDeadline,
    shareDeadlineWithFriends,
    updateMemberStatus,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    declineFriendRequest,
    sendFriendRequest,
    updateUser,
    setTheme,
    toggleNotification,

    // Demo Auth Actions & State
    isAuthenticated,
    login: (demoProfile) => {
      if (demoProfile) {
        setUser((prev) => ({
          ...prev,
          ...demoProfile,
        }));
      }
      setIsAuthenticated(true);
    },
    logout: () => {
      setIsAuthenticated(false);
      setActiveTab('home');
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
