import React, { useState } from 'react';
import {
  FlameIcon,
  AlertTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ZapIcon,
} from '../components/Icons';
import { useApp } from '../context/AppContext';
import { formatDateDisplay } from '../utils/dateUtils';

/**
 * InsightsPage - Academic early-warning analytics and priority planning.
 * Combines:
 * 1. Academic Load Radar (LOW, MODERATE, HEAVY)
 * 2. Deadline Collision Detection (clustered dates alerting)
 * 3. Academic Pressure Meter (Day, Week, Month workload concentration)
 * 4. Academic Completion Streaks (Current streak, Best, On-time vs Late)
 * 5. Smart Priority ("What Should I Do First?" -> DO NOW, DO NEXT, LATER)
 * 6. Rescue Plan (3-step action roadmap)
 */
function InsightsPage() {
  const {
    academicLoad,
    collisionData,
    academicPressure,
    smartPriority,
    rescuePlan,
    streaks,
    setSelectedDeadline,
    toggleCompleteDeadline,
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState('priority'); // 'priority' | 'pressure' | 'rescue'

  const { doNow, doNext, later } = smartPriority;

  return (
    <div className="insights-page">
      {/* Title */}
      <section className="page-title-section">
        <div className="page-title-text">
          <h1 className="page-title">Insights</h1>
          <p className="page-subtitle">
            Early-warning radar, workload analytics, and Smart Priority ranking.
          </p>
        </div>
      </section>

      {/* 1. Academic Load Radar Card */}
      <section className="insights-card load-radar-card">
        <div className="load-radar-header">
          <div>
            <span className="insights-sublabel">EARLY-WARNING RADAR</span>
            <h2 className="load-radar-title">Academic Load Status</h2>
          </div>
          <span className={`load-badge load-badge--${academicLoad.level.toLowerCase()}`}>
            {academicLoad.level} LOAD
          </span>
        </div>

        <p className="load-radar-explanation">{academicLoad.explanation}</p>

        <div className="load-radar-stats">
          <div className="load-stat-chip">
            <span className="load-stat-num">{academicLoad.pendingCount}</span>
            <span className="load-stat-lbl">Active Deadlines</span>
          </div>
          <div className="load-stat-chip">
            <span className="load-stat-num">{academicLoad.totalHours}h</span>
            <span className="load-stat-lbl">Estimated Effort</span>
          </div>
          <div className="load-stat-chip">
            <span className="load-stat-num">{academicLoad.urgentCount}</span>
            <span className="load-stat-lbl">Immediate Tasks</span>
          </div>
        </div>
      </section>

      {/* 2. Deadline Collision Detection */}
      {collisionData.hasCollision ? (
        <section className="insights-card collision-card">
          <div className="collision-card-header">
            <div className="collision-card-icon">
              <AlertTriangleIcon />
            </div>
            <div>
              <span className="insights-sublabel" style={{ color: '#D97706' }}>
                BOTTLENECK PREDICTION
              </span>
              <h3 className="collision-card-title">Deadline Collision Detected</h3>
            </div>
          </div>

          {collisionData.clusters.map((cluster) => (
            <div key={cluster.date} className="collision-cluster-box">
              <div className="collision-cluster-headline">
                <strong>{cluster.count} deadlines are clustered on {cluster.formattedDate}</strong>
              </div>
              <p className="collision-cluster-desc">
                High concentration risk. Spreading effort across these deliverables now prevents last-minute submissions.
              </p>
              <div className="collision-cluster-items">
                {cluster.deadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="collision-cluster-pill"
                    onClick={() => setSelectedDeadline(dl)}
                    role="button"
                    tabIndex={0}
                  >
                    <span>{dl.course}</span> · <span>{dl.title}</span> (<span>{dl.estimatedEffort}h</span>)
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="insights-card collision-card collision-card--clear">
          <div className="collision-card-header">
            <div className="collision-card-icon" style={{ backgroundColor: '#2E7D32' }}>
              ✓
            </div>
            <div>
              <span className="insights-sublabel" style={{ color: '#2E7D32' }}>
                SPACING OPTIMAL
              </span>
              <h3 className="collision-card-title">No Deadline Collisions</h3>
            </div>
          </div>
          <p className="load-radar-explanation">
            Your upcoming deadlines are well distributed across different calendar days.
          </p>
        </section>
      )}

      {/* 3. Academic Pressure Meter (NO medical jargon!) */}
      <section className="insights-card pressure-card">
        <div className="pressure-header">
          <div>
            <span className="insights-sublabel">DEADLINE CONCENTRATION</span>
            <h2 className="load-radar-title">Academic Pressure Meter</h2>
          </div>
          <span className="pressure-note">When will I be busiest?</span>
        </div>

        <div className="pressure-grid">
          {/* DAY */}
          <div className="pressure-column">
            <div className="pressure-column-top">
              <span className="pressure-period">TODAY / 24H</span>
              <span className={`pressure-level-tag pressure-level-tag--${academicPressure.day.level}`}>
                {academicPressure.day.level.toUpperCase()}
              </span>
            </div>
            <div className="pressure-bar-track">
              <div
                className={`pressure-bar-fill pressure-bar-fill--${academicPressure.day.level}`}
                style={{ width: `${academicPressure.day.score}%` }}
              />
            </div>
            <div className="pressure-meta">
              <span>{academicPressure.day.count} deliverables</span>
              <span>{academicPressure.day.hours}h effort</span>
            </div>
          </div>

          {/* WEEK */}
          <div className="pressure-column">
            <div className="pressure-column-top">
              <span className="pressure-period">THIS WEEK (7D)</span>
              <span className={`pressure-level-tag pressure-level-tag--${academicPressure.week.level}`}>
                {academicPressure.week.level.toUpperCase()}
              </span>
            </div>
            <div className="pressure-bar-track">
              <div
                className={`pressure-bar-fill pressure-bar-fill--${academicPressure.week.level}`}
                style={{ width: `${academicPressure.week.score}%` }}
              />
            </div>
            <div className="pressure-meta">
              <span>{academicPressure.week.count} deliverables</span>
              <span>{academicPressure.week.hours}h effort</span>
            </div>
          </div>

          {/* MONTH */}
          <div className="pressure-column">
            <div className="pressure-column-top">
              <span className="pressure-period">THIS MONTH (30D)</span>
              <span className={`pressure-level-tag pressure-level-tag--${academicPressure.month.level}`}>
                {academicPressure.month.level.toUpperCase()}
              </span>
            </div>
            <div className="pressure-bar-track">
              <div
                className={`pressure-bar-fill pressure-bar-fill--${academicPressure.month.level}`}
                style={{ width: `${academicPressure.month.score}%` }}
              />
            </div>
            <div className="pressure-meta">
              <span>{academicPressure.month.count} deliverables</span>
              <span>{academicPressure.month.hours}h effort</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. On-Time Completion Streaks Card */}
      <section className="insights-card streak-card">
        <div className="streak-header">
          <div className="streak-hero-left">
            <div className="streak-flame-icon">
              <FlameIcon />
            </div>
            <div>
              <span className="insights-sublabel">CONSISTENCY METRIC</span>
              <h3 className="streak-title">{streaks.currentStreak} Day On-Time Streak</h3>
            </div>
          </div>
          <span className="streak-best-badge">Best: {streaks.bestStreak} days</span>
        </div>

        <div className="streak-stats-row">
          <div className="streak-stat-item">
            <span className="streak-stat-val">{streaks.completedOnTime}</span>
            <span className="streak-stat-lbl">Completed on time</span>
          </div>
          <div className="streak-stat-item">
            <span className="streak-stat-val">{streaks.totalCompleted}</span>
            <span className="streak-stat-lbl">Total completed</span>
          </div>
          <div className="streak-stat-item">
            <span className="streak-stat-val">{streaks.lateCompleted || 0}</span>
            <span className="streak-stat-lbl">Late completions</span>
          </div>
        </div>

        <p className="streak-footnote">
          * Tasks only build the streak when submitted on or before the due date.
        </p>
      </section>

      {/* Section Sub-Nav: SMART PRIORITY vs RESCUE PLAN */}
      <div className="insights-section-tabs">
        <button
          className={`insights-tab-btn ${activeTabSection === 'priority' ? 'insights-tab-btn--active' : ''}`}
          onClick={() => setActiveTabSection('priority')}
        >
          Smart Priority ("What Should I Do First?")
        </button>
        <button
          className={`insights-tab-btn ${activeTabSection === 'rescue' ? 'insights-tab-btn--active' : ''}`}
          onClick={() => setActiveTabSection('rescue')}
        >
          {academicLoad.level === 'HEAVY' ? '🚨 Rescue Plan (Active)' : 'Rescue Plan'}
        </button>
      </div>

      {/* 5. SMART PRIORITY ENGINE */}
      {activeTabSection === 'priority' && (
        <section className="smart-priority-section">
          <div className="smart-priority-intro">
            <h3 className="section-title-small">ACTION RECOMMENDATION</h3>
            <p className="section-sub-small">
              Tasks ranked dynamically by proximity, estimated effort, and collision risk. Tap any item to open details.
            </p>
          </div>

          {/* DO NOW */}
          <div className="priority-group">
            <div className="priority-group__header priority-group__header--donow">
              <span className="priority-group__badge priority-group__badge--donow">DO NOW</span>
              <span className="priority-group__caption">Highest urgency & impact ({doNow.length})</span>
            </div>
            {doNow.length > 0 ? (
              <div className="priority-items-list">
                {doNow.map((item) => (
                  <div
                    key={item.id}
                    className="priority-item-card priority-item-card--donow"
                    onClick={() => setSelectedDeadline(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="priority-item-main">
                      <div className="priority-item-tags">
                        <span className="priority-item-course">{item.course}</span>
                        <span className="priority-item-time">{formatDateDisplay(item.dueDate)} · {item.dueTime}</span>
                      </div>
                      <h4 className="priority-item-title">{item.title}</h4>
                      <div className="priority-item-effort">
                        <ClockIcon /> {item.estimatedEffort}h effort · {item.priority?.toUpperCase()} priority
                      </div>
                    </div>
                    <button
                      className="priority-item-complete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleteDeadline(item.id);
                      }}
                      title="Mark Complete"
                    >
                      <CheckCircleIcon />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="priority-empty-msg">No urgent tasks requiring immediate triage.</p>
            )}
          </div>

          {/* DO NEXT */}
          <div className="priority-group">
            <div className="priority-group__header priority-group__header--donext">
              <span className="priority-group__badge priority-group__badge--donext">DO NEXT</span>
              <span className="priority-group__caption">Approaching within 2-4 days ({doNext.length})</span>
            </div>
            {doNext.length > 0 ? (
              <div className="priority-items-list">
                {doNext.map((item) => (
                  <div
                    key={item.id}
                    className="priority-item-card"
                    onClick={() => setSelectedDeadline(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="priority-item-main">
                      <div className="priority-item-tags">
                        <span className="priority-item-course">{item.course}</span>
                        <span className="priority-item-time">{formatDateDisplay(item.dueDate)}</span>
                      </div>
                      <h4 className="priority-item-title">{item.title}</h4>
                      <div className="priority-item-effort">
                        <ClockIcon /> {item.estimatedEffort}h · {item.priority?.toUpperCase()}
                      </div>
                    </div>
                    <span className="priority-arrow">→</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="priority-empty-msg">No secondary deliverables pending.</p>
            )}
          </div>

          {/* LATER */}
          <div className="priority-group">
            <div className="priority-group__header priority-group__header--later">
              <span className="priority-group__badge priority-group__badge--later">LATER</span>
              <span className="priority-group__caption">Further horizon ({later.length})</span>
            </div>
            {later.length > 0 ? (
              <div className="priority-items-list">
                {later.map((item) => (
                  <div
                    key={item.id}
                    className="priority-item-card priority-item-card--muted"
                    onClick={() => setSelectedDeadline(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="priority-item-main">
                      <div className="priority-item-tags">
                        <span className="priority-item-course">{item.course}</span>
                        <span className="priority-item-time">{formatDateDisplay(item.dueDate)}</span>
                      </div>
                      <h4 className="priority-item-title">{item.title}</h4>
                    </div>
                    <span className="priority-arrow">→</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="priority-empty-msg">No distant deliverables scheduled.</p>
            )}
          </div>
        </section>
      )}

      {/* 6. RESCUE PLAN (3-Step Action Roadmap) */}
      {activeTabSection === 'rescue' && (
        <section className="rescue-plan-section">
          <div className="rescue-plan-hero">
            <div className="rescue-plan-badge">
              <ZapIcon /> THREE-STEP TRIAGE ACTION PLAN
            </div>
            <h3 className="rescue-plan-heading">
              {rescuePlan.isNeeded
                ? 'High Workload Detected — Rescue Sequence Activated'
                : 'Proactive 3-Step Workload Relief Strategy'}
            </h3>
            <p className="rescue-plan-sub">
              When workload feels crowded, do not try to do everything at once. Focus on this sequential 3-step action roadmap to break the logjam.
            </p>
          </div>

          <div className="rescue-steps-container">
            {/* Step 1 */}
            <div className="rescue-step-card rescue-step-card--1">
              <div className="rescue-step-num">STEP 1</div>
              <div className="rescue-step-tag">DO NOW</div>
              <h4 className="rescue-step-title">
                {rescuePlan.step1?.title || 'No urgent items'}
              </h4>
              <p className="rescue-step-desc">
                Focus 100% of your immediate attention here. Clearing this removes your most imminent deadline penalty.
              </p>
              {rescuePlan.step1?.task && (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setSelectedDeadline(rescuePlan.step1.task)}
                >
                  Open {rescuePlan.step1.task.course} Task <ArrowRightIcon />
                </button>
              )}
            </div>

            {/* Step 2 */}
            <div className="rescue-step-card rescue-step-card--2">
              <div className="rescue-step-num">STEP 2</div>
              <div className="rescue-step-tag">DO NEXT</div>
              <h4 className="rescue-step-title">
                {rescuePlan.step2?.title || 'Prepare upcoming materials'}
              </h4>
              <p className="rescue-step-desc">
                Immediately after Step 1, shift into this deliverable to prevent tomorrow's potential bottleneck.
              </p>
              {rescuePlan.step2?.task && (
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => setSelectedDeadline(rescuePlan.step2.task)}
                >
                  View Details <ArrowRightIcon />
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div className="rescue-step-card rescue-step-card--3">
              <div className="rescue-step-num">STEP 3</div>
              <div className="rescue-step-tag">PREPARE LATER</div>
              <h4 className="rescue-step-title">
                {rescuePlan.step3?.title || 'Stage remaining deliverables'}
              </h4>
              <p className="rescue-step-desc">
                Keep on background radar. Review guidelines or outline ahead of time without active execution.
              </p>
              {rescuePlan.step3?.task && (
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => setSelectedDeadline(rescuePlan.step3.task)}
                >
                  View Details <ArrowRightIcon />
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default InsightsPage;
