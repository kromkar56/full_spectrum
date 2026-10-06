import React, { useState, useRef, useEffect } from 'react';
import {
  BellIcon,
  UserIcon,
  FlameIcon,
  CloseIcon,
  AlertTriangleIcon,
  ClockIcon,
  FriendsIcon,
  CheckCircleIcon,
  LogOutIcon,
} from './Icons';
import { useApp } from '../context/AppContext';
import { formatDateDisplay } from '../utils/dateUtils';

/**
 * Header - Top brand bar for DEADLINEO
 * Features:
 * - Brand Logo image and DEADLINEO typography
 * - Interactive Notification bell with real-time early-warning alerts dropdown
 * - On-time streak counter
 * - User avatar button navigating to Profile
 */
function Header() {
  const {
    user,
    streaks,
    deadlines,
    collisionData,
    smartPriority,
    activeTab,
    setActiveTab,
    setSelectedDeadline,
    logout,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const topTask = smartPriority.doNow[0] || smartPriority.allRanked[0];

  return (
    <header className="header">
      <div className="header__inner">
        {/* Brand Logo with New DEADLINEO Logo Image */}
        <div
          className="header__logo"
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          aria-label="Go to DEADLINEO Home"
        >
          <img
            src="/logo.png"
            alt="DEADLINEO Logo"
            className="header__logo-img"
          />
          <span className="header__logo-text">DEADLINEO</span>
        </div>

        {/* Action icons */}
        <div className="header__actions" ref={dropdownRef}>
          {/* Quick On-Time Streak indicator */}
          <button
            className="header__streak-pill"
            onClick={() => setActiveTab('insights')}
            title="View Academic Insights & Streaks"
            aria-label={`Current on-time streak: ${streaks.currentStreak} days`}
          >
            <span className="header__streak-icon">
              <FlameIcon />
            </span>
            <span className="header__streak-count">{streaks.currentStreak}d</span>
          </button>

          {/* Notifications toggle button */}
          <button
            className={`header__icon-btn ${isNotificationsOpen ? 'header__icon-btn--active' : ''}`}
            aria-label="Notifications"
            id="notification-btn"
            onClick={toggleNotifications}
            title={unreadCount > 0 ? `${unreadCount} unread early-warnings` : 'No unread notifications'}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="header__notification-badge" aria-hidden="true">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar - navigates to Profile */}
          <button
            className={`header__avatar ${activeTab === 'profile' ? 'header__avatar--active' : ''}`}
            aria-label="User Profile"
            id="profile-avatar-btn"
            onClick={() => setActiveTab('profile')}
            title={`Logged in as ${user.name}`}
          >
            {user.avatar || <UserIcon />}
          </button>

          {/* Quick Demo Sign Out */}
          <button
            className="header__icon-btn header__logout-btn"
            aria-label="Sign Out"
            id="header-logout-btn"
            onClick={logout}
            title={`Sign out (${user.name})`}
          >
            <LogOutIcon />
          </button>

          {/* Interactive Notifications Popover */}
          {isNotificationsOpen && (
            <div className="notifications-dropdown" role="region" aria-label="Notifications list">
              <div className="notifications-header">
                <div className="notifications-header-left">
                  <h3 className="notifications-title">Early-Warning Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="notifications-count-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    className="notifications-clear-btn"
                    onClick={handleMarkAllRead}
                    id="mark-all-read-btn"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {/* 1. Deadline Collision Notification */}
                {collisionData.hasCollision && (
                  <div
                    className="notification-item notification-item--unread"
                    onClick={() => {
                      setActiveTab('insights');
                      setIsNotificationsOpen(false);
                      setUnreadCount((c) => Math.max(0, c - 1));
                    }}
                  >
                    <div className="notification-icon notification-icon--warning">
                      <AlertTriangleIcon />
                    </div>
                    <div className="notification-content">
                      <h4 className="notification-heading">Deadline Collision Detected!</h4>
                      <p className="notification-body">
                        {collisionData.primaryCollision.count} assignments coincide on{' '}
                        {collisionData.primaryCollision.formattedDate}. Tap for early mitigation.
                      </p>
                      <span className="notification-time">10 mins ago</span>
                    </div>
                  </div>
                )}

                {/* 2. Imminent Deliverable */}
                {topTask && (
                  <div
                    className="notification-item notification-item--unread"
                    onClick={() => {
                      setSelectedDeadline(topTask);
                      setIsNotificationsOpen(false);
                      setUnreadCount((c) => Math.max(0, c - 1));
                    }}
                  >
                    <div className="notification-icon notification-icon--urgent">
                      <ClockIcon />
                    </div>
                    <div className="notification-content">
                      <h4 className="notification-heading">Immediate Action Horizon</h4>
                      <p className="notification-body">
                        "{topTask.title}" ({topTask.course}) is due {formatDateDisplay(topTask.dueDate)} at {topTask.dueTime}.
                      </p>
                      <span className="notification-time">1 hour ago</span>
                    </div>
                  </div>
                )}

                {/* 3. Study Circle Group Update */}
                <div
                  className="notification-item"
                  onClick={() => {
                    setActiveTab('friends');
                    setIsNotificationsOpen(false);
                  }}
                >
                  <div className="notification-icon notification-icon--group">
                    <FriendsIcon />
                  </div>
                  <div className="notification-content">
                    <h4 className="notification-heading">Study Circle Synchronization</h4>
                    <p className="notification-body">
                      Riya Singh completed her portion for "DBMS Group Assignment".
                    </p>
                    <span className="notification-time">3 hours ago</span>
                  </div>
                </div>

                {/* 4. On-Time Streak Encouragement */}
                <div
                  className="notification-item"
                  onClick={() => {
                    setActiveTab('insights');
                    setIsNotificationsOpen(false);
                  }}
                >
                  <div className="notification-icon notification-icon--streak">
                    <FlameIcon />
                  </div>
                  <div className="notification-content">
                    <h4 className="notification-heading">Streak Reminder</h4>
                    <p className="notification-body">
                      You are on a {streaks.currentStreak}-day on-time streak! Complete today's deliverable on time to hit {streaks.currentStreak + 1} days.
                    </p>
                    <span className="notification-time">Yesterday</span>
                  </div>
                </div>
              </div>

              <div className="notifications-footer">
                <button
                  className="notifications-footer-btn"
                  onClick={() => {
                    setActiveTab('insights');
                    setIsNotificationsOpen(false);
                  }}
                >
                  View Full Academic Insights →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
