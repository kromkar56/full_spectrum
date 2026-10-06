import React, { useState } from 'react';
import { CloseIcon, FriendsIcon, TrashIcon } from './Icons';
import { useApp } from '../context/AppContext';

/**
 * FriendProfileModal - Teammate details card.
 * Displays online status, shared deliverable counts, and actions
 * to filter shared assignments or remove friend.
 */
function FriendProfileModal({ friend, isOpen, onClose }) {
  const { removeFriend, deadlines, setActiveTab, setSelectedDeadline } = useApp();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  if (!isOpen || !friend) return null;

  const sharedDeadlines = deadlines.filter((d) =>
    (d.sharedWith || []).some((m) => m.username === friend.username || m.id === friend.id)
  );

  const handleViewShared = () => {
    setActiveTab('deadlines');
    onClose();
  };

  const handleOpenDeadline = (dl) => {
    setSelectedDeadline(dl);
    onClose();
  };

  const handleRemove = () => {
    removeFriend(friend.id);
    setShowRemoveConfirm(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card modal-card--sm"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="friend-profile-title"
      >
        <div className="modal-header">
          <div className="friend-profile-header">
            <div className="friend-profile-avatar">{friend.avatar || friend.name.charAt(0)}</div>
            <div>
              <h3 id="friend-profile-title" className="friend-profile-name">
                {friend.name}
              </h3>
              <div className="friend-profile-handle">{friend.username}</div>
              <div className="friend-profile-status">
                <span className={`status-dot ${friend.online ? 'status-dot--online' : 'status-dot--offline'}`} />
                <span>{friend.online ? 'Active now' : 'Offline'}</span>
                {friend.role && <span className="friend-role-text">· {friend.role}</span>}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="friend-stats-grid">
          <div className="friend-stat-box">
            <span className="friend-stat-num">{sharedDeadlines.length}</span>
            <span className="friend-stat-lbl">Shared Deadlines</span>
          </div>
          <div className="friend-stat-box">
            <span className="friend-stat-num">{friend.completedCount || 0}</span>
            <span className="friend-stat-lbl">Completed</span>
          </div>
          <div className="friend-stat-box">
            <span className="friend-stat-num">{friend.pendingCount || 0}</span>
            <span className="friend-stat-lbl">Pending</span>
          </div>
        </div>

        {/* Shared Deadlines mini list */}
        <div className="friend-shared-section">
          <div className="friend-shared-title">
            <FriendsIcon />
            <span>Shared Deadlines with {friend.name.split(' ')[0]} ({sharedDeadlines.length})</span>
          </div>

          {sharedDeadlines.length > 0 ? (
            <div className="friend-shared-list">
              {sharedDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="friend-shared-item"
                  onClick={() => handleOpenDeadline(dl)}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="friend-shared-item-title">{dl.title}</div>
                    <div className="friend-shared-item-sub">
                      {dl.course} · {dl.dueTime}
                    </div>
                  </div>
                  <span className="friend-shared-item-arrow">→</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state__subtitle" style={{ fontSize: '12.5px', margin: '8px 0' }}>
              No shared deliverables yet with this teammate.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="friend-profile-actions">
          {sharedDeadlines.length > 0 && (
            <button className="btn btn--secondary btn--sm" onClick={handleViewShared}>
              View in Deadlines
            </button>
          )}

          <button
            className="btn btn--danger-outline btn--sm"
            onClick={() => setShowRemoveConfirm(true)}
          >
            <TrashIcon /> <span>Remove Friend</span>
          </button>
        </div>

        {/* Confirmation */}
        {showRemoveConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
              <h4>Remove Teammate?</h4>
              <p>
                Are you sure you want to remove {friend.name} from your study circle?
              </p>
              <div className="delete-confirm-actions">
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => setShowRemoveConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn--danger btn--sm" onClick={handleRemove}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendProfileModal;
