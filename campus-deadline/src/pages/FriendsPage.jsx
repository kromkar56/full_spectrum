import React, { useState, useMemo } from 'react';
import {
  FriendsIcon,
  SearchIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
  ClockIcon,
} from '../components/Icons';
import { useApp } from '../context/AppContext';
import { formatDateDisplay } from '../utils/dateUtils';

/**
 * FriendsPage - Study circle & collaborative deadline hub.
 * Built strictly for academic coordination (NOT a social network).
 * Features:
 * 1. Add Teammate button (Contacts & Username options)
 * 2. Search classmates
 * 3. Incoming Friend Requests with Accept/Decline
 * 4. Your Friends study circle list with online states
 * 5. Shared Deadlines overview with individual member progress synchronization
 */
function FriendsPage() {
  const {
    friends,
    friendRequests,
    deadlines,
    acceptFriendRequest,
    declineFriendRequest,
    setIsAddFriendOpen,
    setSelectedFriend,
    setSelectedDeadline,
    updateMemberStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'shared'

  // Filter friends by search
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const q = searchQuery.toLowerCase();
    return friends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q) ||
        (f.role && f.role.toLowerCase().includes(q))
    );
  }, [friends, searchQuery]);

  // Deadlines that are currently shared with study group members
  const sharedDeadlines = useMemo(() => {
    return deadlines.filter((d) => d.sharedWith && d.sharedWith.length > 0);
  }, [deadlines]);

  const handleMemberStatusCycle = (deadlineId, memberUsername, currentStatus) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'Acknowledged'
        : currentStatus === 'Acknowledged'
        ? 'Completed'
        : 'Pending';
    updateMemberStatus(deadlineId, memberUsername, nextStatus);
  };

  return (
    <div className="friends-page">
      {/* Page Title & Add Friend Action */}
      <section className="page-title-section">
        <div className="page-title-text">
          <h1 className="page-title">Friends & Teammates</h1>
          <p className="page-subtitle">
            Coordinate group deliverables and synchronize study group deadlines.
          </p>
        </div>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => setIsAddFriendOpen(true)}
          id="add-friend-btn"
        >
          <PlusIcon /> <span>Add Friend</span>
        </button>
      </section>

      {/* Search Friends */}
      <div className="search-bar">
        <span className="search-bar__icon">
          <SearchIcon />
        </span>
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search teammates by name or @username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Friend Requests Section (if any pending) */}
      {friendRequests.length > 0 && (
        <section className="friend-requests-section">
          <div className="section-header-compact">
            <h2 className="section-title-small">
              PENDING REQUESTS ({friendRequests.length})
            </h2>
          </div>
          <div className="friend-requests-list">
            {friendRequests.map((req) => (
              <div key={req.id} className="friend-request-card">
                <div className="friend-request-info">
                  <div className="friend-request-avatar">
                    {req.from.avatar || req.from.name.charAt(0)}
                  </div>
                  <div>
                    <div className="friend-request-name">{req.from.name}</div>
                    <div className="friend-request-sub">
                      {req.from.username} · {req.from.role || 'Classmate'}
                    </div>
                  </div>
                </div>

                <div className="friend-request-actions">
                  <button
                    className="btn btn--secondary btn--xs"
                    onClick={() => declineFriendRequest(req.id)}
                    title="Decline request"
                  >
                    Decline
                  </button>
                  <button
                    className="btn btn--primary btn--xs"
                    onClick={() => acceptFriendRequest(req.id)}
                    title="Accept teammate"
                    id={`accept-request-${req.id}`}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shared Deadlines Section */}
      <section className="home-section" style={{ marginTop: '16px' }}>
        <div className="section-header-compact">
          <h2 className="section-title-small">
            SHARED GROUP DELIVERABLES ({sharedDeadlines.length})
          </h2>
          <span className="section-hint">Personal deadlines remain private</span>
        </div>

        {sharedDeadlines.length > 0 ? (
          <div className="shared-deadlines-container">
            {sharedDeadlines.map((dl) => (
              <div
                key={dl.id}
                className="shared-deadline-card"
                onClick={() => setSelectedDeadline(dl)}
                role="button"
                tabIndex={0}
              >
                <div className="shared-deadline-top">
                  <div>
                    <span className="shared-deadline-course">{dl.course}</span>
                    <h3 className="shared-deadline-title">{dl.title}</h3>
                  </div>
                  <div className="shared-deadline-due">
                    {formatDateDisplay(dl.dueDate)} · {dl.dueTime}
                  </div>
                </div>

                {/* Member statuses */}
                <div className="shared-members-status-box" onClick={(e) => e.stopPropagation()}>
                  <div className="shared-members-header">
                    <span>{dl.sharedWith.length} Teammates Connected</span>
                    <span className="shared-sync-label">● Auto-Synchronized</span>
                  </div>

                  <div className="shared-members-grid">
                    {dl.sharedWith.map((member) => (
                      <div key={member.username} className="shared-member-pill-row">
                        <span className="shared-member-avatar-small">
                          {member.name.charAt(0)}
                        </span>
                        <span className="shared-member-pill-name">{member.name.split(' ')[0]}</span>
                        <button
                          className={`member-status-pill member-status-pill--${member.status?.toLowerCase() || 'pending'}`}
                          onClick={() => handleMemberStatusCycle(dl.id, member.username, member.status)}
                          title="Click to cycle status"
                        >
                          {member.status || 'Pending'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <p className="empty-state__title">No shared group deadlines</p>
            <p className="empty-state__subtitle">
              Open any assignment from Deadlines and tap "Share" to coordinate with your study group.
            </p>
          </div>
        )}
      </section>

      {/* Your Friends / Teammates List */}
      <section className="home-section" style={{ marginTop: '24px' }}>
        <div className="section-header-compact">
          <h2 className="section-title-small">YOUR STUDY CIRCLE ({friends.length})</h2>
        </div>

        {filteredFriends.length > 0 ? (
          <div className="friends-list-grid">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="friend-card"
                onClick={() => setSelectedFriend(friend)}
                role="button"
                tabIndex={0}
              >
                <div className="friend-card-left">
                  <div className="friend-avatar-wrapper">
                    <div className="friend-avatar">{friend.avatar || friend.name.charAt(0)}</div>
                    <span className={`friend-online-dot ${friend.online ? 'friend-online-dot--on' : 'friend-online-dot--off'}`} />
                  </div>
                  <div className="friend-info">
                    <h3 className="friend-name">{friend.name}</h3>
                    <div className="friend-handle">{friend.username}</div>
                    <div className="friend-role-badge">{friend.role || 'Student'}</div>
                  </div>
                </div>

                <div className="friend-card-right">
                  <span className="friend-shared-metric">
                    {friend.sharedCount || 0} shared
                  </span>
                  <span className="friend-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state__title">No teammates found</p>
            <p className="empty-state__subtitle">
              Connect with classmates by Contacts or Unique Username.
            </p>
            <button
              className="btn btn--primary btn--sm"
              style={{ marginTop: '14px' }}
              onClick={() => setIsAddFriendOpen(true)}
            >
              + Add a teammate
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default FriendsPage;
