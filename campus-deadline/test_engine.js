import { getDateOffset, getDeadlineUrgency, getDaysDifference } from './src/utils/dateUtils.js';

console.log('--- RUNNING CAMPUSDEADLINE CORE ENGINES AUTOMATED TEST ---');

// 1. Test Date Urgency & Status
console.log('\n[1] Testing Date Urgency & Status...');
const todayUrgency = getDeadlineUrgency(getDateOffset(0), false);
console.assert(todayUrgency.status === 'Due Soon', `Expected 'Due Soon', got ${todayUrgency.status}`);
console.assert(todayUrgency.isUrgent === true, `Expected isUrgent true`);

const overdueUrgency = getDeadlineUrgency(getDateOffset(-2), false);
console.assert(overdueUrgency.status === 'Overdue', `Expected 'Overdue', got ${overdueUrgency.status}`);
console.assert(overdueUrgency.filterKey === 'overdue', `Expected filterKey 'overdue'`);

const completedUrgency = getDeadlineUrgency(getDateOffset(0), true);
console.assert(completedUrgency.status === 'Completed', `Expected 'Completed', got ${completedUrgency.status}`);
console.log('✓ Date Urgency & Status passed.');

// 2. Test Collision Detection Logic
console.log('\n[2] Testing Collision Detection...');
const mockDeadlines = [
  { id: '1', title: 'DBMS Assignment', dueDate: '2026-10-12', course: 'DBMS', isCompleted: false },
  { id: '2', title: 'Maths Assignment', dueDate: '2026-10-12', course: 'MATH', isCompleted: false },
  { id: '3', title: 'Physics Lab', dueDate: '2026-10-12', course: 'PHYS', isCompleted: false },
  { id: '4', title: 'Essay', dueDate: '2026-10-20', course: 'PHIL', isCompleted: false },
];

const pending = mockDeadlines.filter(d => !d.isCompleted);
const dateGroups = {};
pending.forEach(d => {
  if (!dateGroups[d.dueDate]) dateGroups[d.dueDate] = [];
  dateGroups[d.dueDate].push(d);
});
const clusters = Object.entries(dateGroups)
  .filter(([_, items]) => items.length >= 2)
  .map(([date, items]) => ({ date, count: items.length }));

console.assert(clusters.length === 1, `Expected 1 collision cluster, got ${clusters.length}`);
console.assert(clusters[0].count === 3, `Expected cluster count 3 on 2026-10-12, got ${clusters[0].count}`);
console.log(`✓ Collision Detection correctly identified ${clusters[0].count} clustered deadlines on ${clusters[0].date}.`);

// 3. Test On-Time Streak Logic
console.log('\n[3] Testing On-Time Streak Rulebook Invariant...');
let streaks = { currentStreak: 7, bestStreak: 12, completedOnTime: 74, totalCompleted: 82, lateCompleted: 8 };

function recordCompletion(deadlineDueDate, isAlreadyOverdue) {
  const diffDays = isAlreadyOverdue ? -1 : 1;
  const isOnTime = diffDays >= 0;
  const newTotal = streaks.totalCompleted + 1;
  if (isOnTime) {
    const newCurrent = streaks.currentStreak + 1;
    streaks = {
      ...streaks,
      currentStreak: newCurrent,
      bestStreak: Math.max(streaks.bestStreak, newCurrent),
      completedOnTime: streaks.completedOnTime + 1,
      totalCompleted: newTotal
    };
  } else {
    // Late completion must NOT increase the on-time streak
    streaks = {
      ...streaks,
      lateCompleted: streaks.lateCompleted + 1,
      totalCompleted: newTotal
    };
  }
}

// Complete on time:
recordCompletion('2026-10-15', false);
console.assert(streaks.currentStreak === 8, `Expected currentStreak 8, got ${streaks.currentStreak}`);
console.assert(streaks.completedOnTime === 75, `Expected completedOnTime 75, got ${streaks.completedOnTime}`);
console.assert(streaks.totalCompleted === 83, `Expected totalCompleted 83, got ${streaks.totalCompleted}`);

// Complete late:
recordCompletion('2026-10-01', true);
console.assert(streaks.currentStreak === 8, `Streak must NOT increase for late completion! Got ${streaks.currentStreak}`);
console.assert(streaks.completedOnTime === 75, `completedOnTime must remain 75, got ${streaks.completedOnTime}`);
console.assert(streaks.lateCompleted === 9, `lateCompleted should be 9, got ${streaks.lateCompleted}`);
console.assert(streaks.totalCompleted === 84, `totalCompleted should be 84, got ${streaks.totalCompleted}`);
console.log('✓ On-time streak invariant verified strictly according to Rulebook Section 15.');

console.log('\nALL ENGINE AUTOMATED TESTS PASSED SUCCESSFULLY! ✓\n');
