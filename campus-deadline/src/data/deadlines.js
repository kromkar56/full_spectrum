import { getDateOffset } from '../utils/dateUtils';

/**
 * Initial academic deliverables dataset.
 * Modeled for realistic student semester workflows with deliberate collision clustering
 * (e.g., DBMS Assignment, Mathematics Assignment, and Physics Lab landing on the same day).
 */
export const INITIAL_DEADLINES = [
  {
    id: 'dl-1',
    course: 'DBMS',
    courseCode: 'CS 310',
    title: 'DBMS Group Assignment',
    type: 'Assignment',
    dueDate: getDateOffset(0), // Today
    dueTime: '11:59 PM',
    priority: 'high',
    estimatedEffort: 2.0, // hours
    progressPercent: 75,
    isCompleted: false,
    completedAt: null,
    completedOnTime: null,
    notes: 'Normalized database schema design and SQL query optimization report.',
    sharedWith: [
      { id: 'f-1', name: 'Aarav Sharma', username: '@aarav_07', status: 'Acknowledged' },
      { id: 'f-2', name: 'Riya Singh', username: '@riya_s', status: 'Completed' },
      { id: 'f-3', name: 'Rahul Kumar', username: '@rahulk', status: 'Pending' }
    ]
  },
  {
    id: 'dl-2',
    course: 'MATHEMATICS',
    courseCode: 'MATH 302',
    title: 'Mathematics Assignment: Vector Spaces',
    type: 'Assignment',
    dueDate: getDateOffset(0), // Clustered with dl-1 and dl-3
    dueTime: '6:00 PM',
    priority: 'high',
    estimatedEffort: 2.5,
    progressPercent: 60,
    isCompleted: false,
    completedAt: null,
    completedOnTime: null,
    notes: 'Orthogonal projections and inner product proofs for problem set 04.',
    sharedWith: []
  },
  {
    id: 'dl-3',
    course: 'PHYSICS',
    courseCode: 'PHYS 210',
    title: 'Physics Lab Report: Electromagnetism',
    type: 'Lab',
    dueDate: getDateOffset(0), // Clustered: 3 deadlines on the same date!
    dueTime: '9:00 PM',
    priority: 'medium',
    estimatedEffort: 3.0,
    progressPercent: 40,
    isCompleted: false,
    completedAt: null,
    completedOnTime: null,
    notes: 'Faraday induction experiment data analysis and error calculation.',
    sharedWith: [
      { id: 'f-1', name: 'Aarav Sharma', username: '@aarav_07', status: 'Acknowledged' }
    ]
  },
  {
    id: 'dl-4',
    course: 'COMPUTER SCIENCE',
    courseCode: 'CS 341',
    title: 'Graph Traversal & Dijkstra Implementation',
    type: 'Project',
    dueDate: getDateOffset(2),
    dueTime: '11:59 PM',
    priority: 'high',
    estimatedEffort: 4.0,
    progressPercent: 30,
    isCompleted: false,
    completedAt: null,
    completedOnTime: null,
    notes: 'Shortest path implementation with Fibonacci heaps benchmark.',
    sharedWith: []
  },
  {
    id: 'dl-5',
    course: 'DATA SCIENCE',
    courseCode: 'STAT 280',
    title: 'Exploratory Data Analysis Report',
    type: 'Assignment',
    dueDate: getDateOffset(4),
    dueTime: '5:00 PM',
    priority: 'medium',
    estimatedEffort: 2.5,
    progressPercent: 15,
    isCompleted: false,
    completedAt: null,
    completedOnTime: null,
    notes: 'Univariate and bivariate statistical summary of campus transit data.',
    sharedWith: []
  },
  {
    id: 'dl-6',
    course: 'HUMANITIES',
    courseCode: 'PHIL 105',
    title: 'Ethics in AI & Cognitive Systems Essay',
    type: 'Assignment',
    dueDate: getDateOffset(8),
    dueTime: '11:59 PM',
    priority: 'low',
    estimatedEffort: 3.0,
    progressPercent: 0,
    isCompleted: false,
    completedAt: null,
    completedOnTime: null,
    notes: 'Moral culpability in autonomous decision algorithms (1,500 words).',
    sharedWith: []
  }
];

export const INITIAL_FRIENDS = [
  {
    id: 'f-1',
    name: 'Aarav Sharma',
    username: '@aarav_07',
    avatar: 'A',
    online: true,
    sharedCount: 2,
    completedCount: 14,
    pendingCount: 2,
    role: 'Computer Science · 3rd Year'
  },
  {
    id: 'f-2',
    name: 'Riya Singh',
    username: '@riya_s',
    avatar: 'R',
    online: true,
    sharedCount: 1,
    completedCount: 21,
    pendingCount: 1,
    role: 'Data Science · 3rd Year'
  },
  {
    id: 'f-3',
    name: 'Rahul Kumar',
    username: '@rahulk',
    avatar: 'R',
    online: false,
    sharedCount: 1,
    completedCount: 11,
    pendingCount: 3,
    role: 'Electrical Eng · 3rd Year'
  },
  {
    id: 'f-4',
    name: 'Ananya Iyer',
    username: '@ananya_i',
    avatar: 'A',
    online: true,
    sharedCount: 0,
    completedCount: 18,
    pendingCount: 0,
    role: 'Mathematics · 2nd Year'
  }
];

export const INITIAL_CONTACTS = [
  { id: 'c-1', name: 'Aarav Sharma', username: '@aarav_07', status: 'friends' },
  { id: 'c-2', name: 'Riya Singh', username: '@riya_s', status: 'friends' },
  { id: 'c-3', name: 'Rahul Kumar', username: '@rahulk', status: 'friends' },
  { id: 'c-4', name: 'Tanvi Verma', username: '@tanvi_v', status: 'not_added' },
  { id: 'c-5', name: 'Dev Patel', username: '@dev_p', status: 'not_added' },
  { id: 'c-6', name: 'Ishaan Gupta', username: '@ishaan_g', status: 'pending' }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    from: {
      name: 'Kavya Nair',
      username: '@kavya_n',
      role: 'Physics · 2nd Year',
      avatar: 'K'
    },
    date: 'Today'
  }
];

export const INITIAL_USER = {
  name: 'Shivam Sharma',
  username: '@shivam_s',
  role: 'CS Undergrad · Year 3',
  email: 'shivam.sharma@campus.edu',
  avatar: 'S',
  theme: 'light',
  notifications: {
    deadlineReminders: true,
    sharedUpdates: true,
    streakReminders: true
  },
  privacy: {
    personalDeadlinesPrivate: true,
    sharedVisibleToTeammates: true
  }
};

export const INITIAL_STREAKS = {
  currentStreak: 7,
  bestStreak: 12,
  completedOnTime: 74,
  totalCompleted: 82,
  lateCompleted: 8
};
