import React, { useState } from 'react';
import { CloseIcon, FriendsIcon } from './Icons';
import { useApp } from '../context/AppContext';

/**
 * ShareDeadlineModal - Dialog to select study group teammates for a deadline.
 * Synchronizes with the shared deadline pool and team member tracking.
 */
function ShareDeadlineModal({ deadline, isOpen, onClose }) {
  const { friends, shareDeadlineWithFriends } = useApp();

  const [selectedIds, setSelectedIds] = useState(() => {
    return deadline?.sharedWith ? deadline.sharedWith.map((m) => m.id) : [];
  });

  if (!isOpen || !deadline) return null;

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const selectedFriends = friends.filter((f) => selectedIds.includes(f.id));
    shareDeadlineWithFriends(deadline.id, selectedFriends);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card modal-card--sm"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="share-modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="share-modal-title" className="modal-title">
              Share Deliverable
            </h3>
            <p className="modal-subtitle">
              Select teammates to sync "{deadline.title}".
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </div>

        <div className="share-friends-list">
          {friends.length > 0 ? (
            friends.map((friend) => {
              const isSelected = selectedIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  className={`share-friend-row ${isSelected ? 'share-friend-row--selected' : ''}`}
                  onClick={() => toggleSelect(friend.id)}
                >
                  <div className="share-friend-avatar">
                    {friend.avatar || friend.name.charAt(0)}
                  </div>
                  <div className="share-friend-details">
                    <div className="share-friend-name">{friend.name}</div>
                    <div className="share-friend-user">{friend.username}</div>
                  </div>
                  <input
                    type="checkbox"
                    className="share-friend-checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(friend.id)}
                  />
                </div>
              );
            })
          ) : (
            <p className="empty-state__subtitle">
              No friends added yet. Add friends from the Friends tab first.
            </p>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSave} id="confirm-share-btn">
            Save Shared Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareDeadlineModal;
