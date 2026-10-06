import React, { useState } from 'react';
import { CloseIcon, SearchIcon, UserPlusIcon } from './Icons';
import { useApp } from '../context/AppContext';

/**
 * AddFriendModal - Multi-method friend addition dialog.
 * Supports:
 * OPTION 1: Add from Contacts (with permission request and status state buttons)
 * OPTION 2: Add by Unique Username (with '@' validation and user search)
 */
function AddFriendModal({ isOpen, onClose }) {
  const { contacts, addFriend, friends } = useApp();

  const [activeMethod, setActiveMethod] = useState('contacts'); // 'contacts' | 'username'
  const [contactsPermissionGranted, setContactsPermissionGranted] = useState(true);
  const [contactsSearch, setContactsSearch] = useState('');
  const [sentRequestMap, setSentRequestMap] = useState({});

  // Username search state
  const [usernameInput, setUsernameInput] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  if (!isOpen) return null;

  // Mock directory for username lookup
  const MOCK_DIRECTORY = [
    { name: 'Kavya Nair', username: '@kavya_n', role: 'Physics · 2nd Year', avatar: 'K' },
    { name: 'Dev Patel', username: '@dev_p', role: 'Mechanical Eng · 3rd Year', avatar: 'D' },
    { name: 'Tanvi Verma', username: '@tanvi_v', role: 'Computer Science · 2nd Year', avatar: 'T' },
    { name: 'Rohan Joshi', username: '@rohan_j', role: 'Biotechnology · 4th Year', avatar: 'R' },
  ];

  const handleContactAdd = (contact) => {
    // If already friends, do nothing
    if (contact.status === 'friends') return;

    // Simulate sending request or immediately connecting
    setSentRequestMap((prev) => ({
      ...prev,
      [contact.id]: 'Request Sent',
    }));

    // Add to friends list if not already present
    const isAlreadyFriend = friends.some((f) => f.username === contact.username);
    if (!isAlreadyFriend) {
      addFriend({
        id: `f-${Date.now()}-${contact.id}`,
        name: contact.name,
        username: contact.username,
        avatar: contact.name.charAt(0),
        online: true,
        sharedCount: 0,
        completedCount: 8,
        pendingCount: 2,
        role: 'Classmate',
      });
    }
  };

  const handleUsernameSearch = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setSearchSubmitted(true);
    let query = usernameInput.trim().toLowerCase();
    if (!query.startsWith('@')) query = `@${query}`;

    const match = MOCK_DIRECTORY.find((u) => u.username.toLowerCase() === query);
    setFoundUser(match || null);
  };

  const handleAddFoundUser = () => {
    if (!foundUser) return;
    const isAlreadyFriend = friends.some((f) => f.username === foundUser.username);
    if (!isAlreadyFriend) {
      addFriend({
        id: `f-${Date.now()}`,
        name: foundUser.name,
        username: foundUser.username,
        avatar: foundUser.avatar,
        online: true,
        sharedCount: 0,
        completedCount: 6,
        pendingCount: 1,
        role: foundUser.role,
      });
    }
    onClose();
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactsSearch.toLowerCase()) ||
      c.username.toLowerCase().includes(contactsSearch.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card modal-card--friends"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="add-friend-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="add-friend-title" className="modal-title">
              Add Teammates
            </h3>
            <p className="modal-subtitle">
              Connect with classmates to share deadlines and balance study group workloads.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="method-tabs">
          <button
            className={`method-tab-btn ${activeMethod === 'contacts' ? 'method-tab-btn--active' : ''}`}
            onClick={() => setActiveMethod('contacts')}
          >
            Option 1: Add from Contacts
          </button>
          <button
            className={`method-tab-btn ${activeMethod === 'username' ? 'method-tab-btn--active' : ''}`}
            onClick={() => setActiveMethod('username')}
          >
            Option 2: Add by Username
          </button>
        </div>

        {/* ================= OPTION 1: CONTACTS ================= */}
        {activeMethod === 'contacts' && (
          <div className="method-content">
            {!contactsPermissionGranted ? (
              <div className="permission-card">
                <p className="permission-text">
                  Allow contact access to find classmates and teammates.
                </p>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setContactsPermissionGranted(true)}
                >
                  Grant Contact Permission
                </button>
              </div>
            ) : (
              <div>
                <div className="search-bar" style={{ marginBottom: '14px' }}>
                  <span className="search-bar__icon">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Search device contacts..."
                    value={contactsSearch}
                    onChange={(e) => setContactsSearch(e.target.value)}
                  />
                </div>

                <div className="contacts-list">
                  {filteredContacts.map((contact) => {
                    const localStatus = sentRequestMap[contact.id];
                    const isFriends = contact.status === 'friends' || localStatus === 'Request Sent';

                    let buttonLabel = 'Add';
                    let buttonClass = 'btn--secondary';

                    if (localStatus) {
                      buttonLabel = localStatus;
                      buttonClass = 'btn--success';
                    } else if (contact.status === 'friends') {
                      buttonLabel = 'Friends';
                      buttonClass = 'btn--disabled';
                    } else if (contact.status === 'pending') {
                      buttonLabel = 'Pending';
                      buttonClass = 'btn--pending';
                    }

                    return (
                      <div key={contact.id} className="contact-row">
                        <div className="contact-avatar">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="contact-details">
                          <span className="contact-name">{contact.name}</span>
                          <span className="contact-username">{contact.username}</span>
                        </div>
                        <button
                          className={`btn ${buttonClass} btn--xs`}
                          onClick={() => handleContactAdd(contact)}
                          disabled={contact.status === 'friends' || localStatus === 'Request Sent'}
                        >
                          {buttonLabel}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= OPTION 2: USERNAME ================= */}
        {activeMethod === 'username' && (
          <div className="method-content">
            <form onSubmit={handleUsernameSearch} className="username-search-form">
              <label className="form-label" htmlFor="username-search-input">
                Enter unique username (@format)
              </label>
              <div className="search-bar-with-btn">
                <input
                  id="username-search-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. @kavya_n or @dev_p"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setSearchSubmitted(false);
                  }}
                  required
                />
                <button type="submit" className="btn btn--primary btn--sm" id="search-username-btn">
                  Search
                </button>
              </div>
            </form>

            {searchSubmitted && (
              <div className="username-result-area">
                {foundUser ? (
                  <div className="found-user-card">
                    <div className="found-user-info">
                      <div className="found-user-avatar">{foundUser.avatar}</div>
                      <div>
                        <div className="found-user-name">{foundUser.name}</div>
                        <div className="found-user-handle">{foundUser.username}</div>
                        <div className="found-user-role">{foundUser.role}</div>
                      </div>
                    </div>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={handleAddFoundUser}
                      id="add-found-user-btn"
                    >
                      <UserPlusIcon /> <span>Add Friend</span>
                    </button>
                  </div>
                ) : (
                  <div className="empty-state empty-state--compact">
                    <p className="empty-state__title">No user found</p>
                    <p className="empty-state__subtitle">
                      Verify the unique handle (e.g. try @kavya_n, @dev_p, @tanvi_v).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFriendModal;
