import React from 'react';
import {
  ClockIcon,
  PlusIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  FlameIcon,
  CheckCircleIcon,
  FriendsIcon,
} from '../components/Icons';
import { useApp } from '../context/AppContext';
import { formatDateDisplay, getDeadlineUrgency } from '../utils/dateUtils';

/**
 * HomePage - Personal early-warning command center.
 * Displays:
 * 1. Personal Greeting ("Good morning, Shivam")
 * 2. Academic Load Radar status badge (LOW, MODERATE, HEAVY)
 * 3. Most Important Upcoming Deadline card
 * 4. "WHAT'S NEXT" ranked checklist
 * 5. Collision Alert banner (when deadlines cluster on one date)
 * 6. Quick Action triggers (+ Add Deadline, View Smart Priority)
 */
function HomePage() {
  const {
    user,
    deadlines,
    academicLoad,
    collisionData,
    smartPriority,
    streaks,
    setActiveTab,
    setSelectedDeadline,
    setIsAddDeadlineOpen,
    toggleCompleteDeadline,
  } = useApp();

  // Find most important pending deadline (highest score in smart priority)
  const topDeadline = smartPriority.doNow[0] || smartPriority.allRanked[0] || null;
  const whatsNextList = smartPriority.allRanked.slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleOpenTopDeadline = () => {
    if (topDeadline) {
      setSelectedDeadline(topDeadline);
    }
  };

  return (
    <div className="home-page">
      {/* 1. Header Greeting & Academic Load Status */}
      <section className="home-hero">
        <div className="home-hero__welcome">
          <span className="home-hero__subtitle">ACADEMIC EARLY-WARNING</span>
          <h1 className="home-hero__greeting">
            {getGreeting()}, {user.name.split(' ')[0]}
          </h1>
        </div>

        {/* Workload Indicator Badge */}
        <div className="home-hero__load-box">
          <div className="home-load-pill-group">
            <span className="home-load-lbl">WORKLOAD</span>
            <span
              className={`load-badge load-badge--${academicLoad.level.toLowerCase()}`}
              title={academicLoad.explanation}
              onClick={() => setActiveTab('insights')}
              style={{ cursor: 'pointer' }}
            >
              {academicLoad.level}
            </span>
          </div>
          <span className="home-load-detail">
            {academicLoad.pendingCount} pending · {academicLoad.totalHours}h effort
          </span>
        </div>
      </section>

      {/* 2. Collision Warning Banner (if multiple deadlines cluster) */}
      {collisionData.hasCollision && (
        <section
          className="collision-alert-banner"
          onClick={() => setActiveTab('insights')}
          role="region"
          aria-label="Deadline collision alert"
        >
          <div className="collision-alert-banner__icon">
            <AlertTriangleIcon />
          </div>
          <div className="collision-alert-banner__content">
            <h4 className="collision-alert-banner__title">
              {collisionData.primaryCollision.count} deadlines are clustered on{' '}
              {collisionData.primaryCollision.formattedDate}
            </h4>
            <p className="collision-alert-banner__subtitle">
              Bottleneck detected:{' '}
              {collisionData.primaryCollision.deadlines.map((d) => d.course).join(', ')}.
              Tap to view Academic Insights & early mitigation strategy.
            </p>
          </div>
          <span className="collision-alert-banner__arrow">
            <ArrowRightIcon />
          </span>
        </section>
      )}

      {/* 3. Most Important Upcoming Deadline Card */}
      <section className="home-section">
        <div className="section-header-compact">
          <h2 className="section-title-small">YOUR NEXT IMPORTANT DEADLINE</h2>
          {topDeadline && (
            <span className="section-tag-urgent">
              {getDeadlineUrgency(topDeadline.dueDate, topDeadline.isCompleted).label}
            </span>
          )}
        </div>

        {topDeadline ? (
          <div
            className="top-deadline-card"
            onClick={handleOpenTopDeadline}
            role="button"
            tabIndex={0}
          >
            <div className="top-deadline-card__top">
              <span className="top-deadline-card__course">
                {topDeadline.course} · {topDeadline.courseCode}
              </span>
              <span className={`top-deadline-card__priority top-deadline-card__priority--${topDeadline.priority}`}>
                {topDeadline.priority?.toUpperCase()} PRIORITY
              </span>
            </div>

            <h3 className="top-deadline-card__title">{topDeadline.title}</h3>

            <div className="top-deadline-card__datetime">
              <span className="top-deadline-card__date">
                {formatDateDisplay(topDeadline.dueDate)}
              </span>
              <span className="top-deadline-card__time">· {topDeadline.dueTime}</span>
              <span className="top-deadline-card__effort">
                · {topDeadline.estimatedEffort}h effort
              </span>
            </div>

            {/* Quick Action bar inside Top Deadline Card */}
            <div className="top-deadline-card__footer" onClick={(e) => e.stopPropagation()}>
              <button
                className="top-deadline-btn top-deadline-btn--complete"
                onClick={() => toggleCompleteDeadline(topDeadline.id)}
                id="home-complete-top-btn"
              >
                <CheckCircleIcon /> <span>Mark Complete</span>
              </button>

              <button
                className="top-deadline-btn top-deadline-btn--details"
                onClick={handleOpenTopDeadline}
                id="home-open-top-btn"
              >
                Open Details <ArrowRightIcon />
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <p className="empty-state__title">All caught up!</p>
            <p className="empty-state__subtitle">
              No pending deadlines on your radar. Relax or add an upcoming assignment.
            </p>
          </div>
        )}
      </section>

      {/* 4. "WHAT'S NEXT" Ranked Deliverables List */}
      <section className="home-section">
        <div className="section-header-compact">
          <h2 className="section-title-small">WHAT'S NEXT</h2>
          <button
            className="section-link-btn"
            onClick={() => setActiveTab('deadlines')}
          >
            View all ({deadlines.length}) <ArrowRightIcon />
          </button>
        </div>

        {whatsNextList.length > 0 ? (
          <div className="whats-next-list">
            {whatsNextList.map((item, index) => {
              const urgency = getDeadlineUrgency(item.dueDate, item.isCompleted);
              return (
                <div
                  key={item.id}
                  className="whats-next-item"
                  onClick={() => setSelectedDeadline(item)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="whats-next-rank">{index + 1}</span>

                  <div className="whats-next-details">
                    <div className="whats-next-title-row">
                      <span className="whats-next-title">{item.title}</span>
                      {item.sharedWith?.length > 0 && (
                        <span className="whats-next-shared-icon" title="Group assignment">
                          <FriendsIcon />
                        </span>
                      )}
                    </div>
                    <div className="whats-next-meta">
                      <span className="whats-next-course">{item.course}</span>
                      <span className="whats-next-dot">·</span>
                      <span className="whats-next-due">{formatDateDisplay(item.dueDate)}</span>
                      <span className="whats-next-dot">·</span>
                      <span className="whats-next-effort">{item.estimatedEffort}h</span>
                    </div>
                  </div>

                  <span
                    className={`whats-next-badge ${
                      urgency.isUrgent ? 'whats-next-badge--urgent' : ''
                    }`}
                  >
                    {urgency.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <p className="empty-state__subtitle">No deliverables queued.</p>
          </div>
        )}
      </section>

      {/* 5. Quick Actions & Streak Banner */}
      <section className="home-bottom-actions">
        <div
          className="home-streak-widget"
          onClick={() => setActiveTab('insights')}
          role="button"
          tabIndex={0}
        >
          <div className="home-streak-icon-box">
            <FlameIcon />
          </div>
          <div>
            <div className="home-streak-title">
              {streaks.currentStreak} Day On-Time Streak
            </div>
            <div className="home-streak-sub">
              {streaks.completedOnTime} completed on time · Tap for Smart Priority
            </div>
          </div>
        </div>

        <button
          className="btn btn--primary home-quick-add-btn"
          onClick={() => setIsAddDeadlineOpen(true)}
          id="home-quick-add-deadline-btn"
        >
          <PlusIcon /> <span>Add Deadline</span>
        </button>
      </section>
    </div>
  );
}

export default HomePage;
