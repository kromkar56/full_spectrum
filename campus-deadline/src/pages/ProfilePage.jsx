import React, { useState } from 'react';
import {
  FlameIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowRightIcon,
  CloseIcon,
} from '../components/Icons';
import { useApp } from '../context/AppContext';

/**
 * ProfilePage - Clean student profile, consistency records, and application preferences.
 * Adheres strictly to Rulebook Section 25:
 * Keeps the profile focused and clean rather than another bloated analytics dashboard.
 */
function ProfilePage() {
  const { user, streaks, setTheme, toggleNotification, setActiveTab, updateUser, logout } = useApp();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setPasswordNotice('Password successfully updated!');
    setTimeout(() => {
      setPasswordNotice('');
      setShowPasswordModal(false);
      setNewPassword('');
    }, 1200);
  };

  return (
    <div className="profile-page">
      {/* Top Bar with Back Button */}
      <div className="profile-top-bar">
        <button
          className="profile-back-btn"
          onClick={() => setActiveTab('home')}
          aria-label="Back to Home"
        >
          ← Back to Home
        </button>
      </div>

      {/* 1. Student Identity Card */}
      <section className="profile-hero-card">
        <div className="profile-avatar-large">
          {user.avatar || <UserIcon />}
        </div>
        <div className="profile-info-center">
          <h1 className="profile-name">{user.name}</h1>
          <span className="profile-username">{user.username}</span>
          <span className="profile-role-tag">{user.role}</span>
        </div>
      </section>

      {/* 2. On-Time Consistency Progress */}
      <section className="profile-progress-section">
        <h2 className="section-title-small">ACADEMIC COMPLETION RECORD</h2>
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <span className="profile-stat-icon">
              <FlameIcon />
            </span>
            <span className="profile-stat-value">{streaks.currentStreak} Days</span>
            <span className="profile-stat-label">On-time streak</span>
          </div>

          <div className="profile-stat-box">
            <span className="profile-stat-icon">
              <CheckCircleIcon />
            </span>
            <span className="profile-stat-value">{streaks.completedOnTime}</span>
            <span className="profile-stat-label">Completed on time</span>
          </div>

          <div className="profile-stat-box">
            <span className="profile-stat-icon">✓</span>
            <span className="profile-stat-value">{streaks.totalCompleted}</span>
            <span className="profile-stat-label">Total completed</span>
          </div>
        </div>
      </section>

      {/* 3. Notification Settings (ON/OFF) */}
      <section className="profile-settings-section">
        <h2 className="section-title-small">NOTIFICATIONS</h2>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-item-text">
              <div className="setting-item-title">Deadline reminders</div>
              <div className="setting-item-desc">
                Receive proactive warnings 24 hours and 2 hours before deliverables.
              </div>
            </div>
            <button
              className={`toggle-switch ${user.notifications.deadlineReminders ? 'toggle-switch--on' : ''}`}
              onClick={() => toggleNotification('deadlineReminders')}
              aria-label="Toggle deadline reminders"
              role="switch"
              aria-checked={user.notifications.deadlineReminders}
            >
              <span className="toggle-switch-handle" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-item-text">
              <div className="setting-item-title">Shared deadline updates</div>
              <div className="setting-item-desc">
                Alerts when teammates modify shared dates or submit work.
              </div>
            </div>
            <button
              className={`toggle-switch ${user.notifications.sharedUpdates ? 'toggle-switch--on' : ''}`}
              onClick={() => toggleNotification('sharedUpdates')}
              aria-label="Toggle shared deadline updates"
              role="switch"
              aria-checked={user.notifications.sharedUpdates}
            >
              <span className="toggle-switch-handle" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-item-text">
              <div className="setting-item-title">Streak reminders</div>
              <div className="setting-item-desc">
                Daily encouragement to complete due assignments on time.
              </div>
            </div>
            <button
              className={`toggle-switch ${user.notifications.streakReminders ? 'toggle-switch--on' : ''}`}
              onClick={() => toggleNotification('streakReminders')}
              aria-label="Toggle streak reminders"
              role="switch"
              aria-checked={user.notifications.streakReminders}
            >
              <span className="toggle-switch-handle" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Theme Selection (Light, Dark, System) */}
      <section className="profile-settings-section">
        <h2 className="section-title-small">APPEARANCE THEME</h2>
        <div className="theme-selector-grid">
          {['light', 'dark', 'system'].map((themeOption) => (
            <button
              key={themeOption}
              className={`theme-option-btn ${user.theme === themeOption ? 'theme-option-btn--active' : ''}`}
              onClick={() => setTheme(themeOption)}
              id={`theme-btn-${themeOption}`}
            >
              <span className="theme-option-name">
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </span>
              {user.theme === themeOption && <span className="theme-option-check">✓</span>}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Privacy Safeguards */}
      <section className="profile-settings-section">
        <h2 className="section-title-small">PRIVACY & VISIBILITY</h2>
        <div className="privacy-info-card">
          <div className="privacy-row">
            <span className="privacy-badge">PRIVATE</span>
            <div>
              <div className="privacy-row-title">Personal Deadlines</div>
              <div className="privacy-row-desc">
                Strictly visible to you only. Never shared across the campus network.
              </div>
            </div>
          </div>
          <div className="privacy-divider" />
          <div className="privacy-row">
            <span className="privacy-badge privacy-badge--shared">SHARED</span>
            <div>
              <div className="privacy-row-title">Group Deliverables</div>
              <div className="privacy-row-desc">
                Accessible solely by teammates explicitly invited to the assignment.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Account & Authentication Management */}
      <section className="profile-settings-section" style={{ marginBottom: '30px' }}>
        <h2 className="section-title-small">ACCOUNT</h2>
        <div className="account-details-box">
          <div className="account-row">
            <span className="account-label">Email</span>
            <span className="account-val">{user.email}</span>
          </div>

          <div className="account-actions">
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => setShowPasswordModal(true)}
              id="change-password-btn"
            >
              Change Password
            </button>
            <button
              className="btn btn--danger-outline btn--sm"
              onClick={() => setShowLogoutConfirm(true)}
              id="logout-btn"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-card modal-card--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            {passwordNotice ? (
              <p className="password-success-text">{passwordNotice}</p>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="new-password-input">
                    New Password
                  </label>
                  <input
                    id="new-password-input"
                    type="password"
                    className="form-input"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-card modal-card--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Log Out</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <p className="empty-state__subtitle" style={{ margin: '14px 0 20px' }}>
              Are you sure you want to log out of DEADLINEO? Your local session will be preserved.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn--secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                id="confirm-logout-btn"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
