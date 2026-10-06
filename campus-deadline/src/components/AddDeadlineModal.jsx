import React, { useState, useEffect } from 'react';
import { CloseIcon, PlusIcon } from './Icons';
import { useApp } from '../context/AppContext';
import { getDateOffset } from '../utils/dateUtils';

const DEADLINE_TYPES = ['Assignment', 'Exam', 'Project', 'Lab', 'Meeting', 'Other'];
const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

/**
 * AddDeadlineModal - Form modal for creating or editing an academic deadline.
 * Captures title, subject/course, type, date, time, priority, estimated effort,
 * and optional study group teammate sharing.
 */
function AddDeadlineModal({ isOpen, onClose, initialData = null }) {
  const { addDeadline, updateDeadline, friends } = useApp();

  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [type, setType] = useState('Assignment');
  const [dueDate, setDueDate] = useState(getDateOffset(0));
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [priority, setPriority] = useState('high');
  const [estimatedEffort, setEstimatedEffort] = useState(2.0);
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);
  const [notes, setNotes] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCourse(initialData.course || '');
      setCourseCode(initialData.courseCode || '');
      setType(initialData.type || 'Assignment');
      setDueDate(initialData.dueDate || getDateOffset(0));
      setDueTime(initialData.dueTime || '11:59 PM');
      setPriority(initialData.priority || 'medium');
      setEstimatedEffort(initialData.estimatedEffort || 2.0);
      setNotes(initialData.notes || '');
      setSelectedFriendIds(
        initialData.sharedWith ? initialData.sharedWith.map((m) => m.id) : []
      );
    } else {
      // Reset defaults
      setTitle('');
      setCourse('');
      setCourseCode('');
      setType('Assignment');
      setDueDate(getDateOffset(0));
      setDueTime('11:59 PM');
      setPriority('high');
      setEstimatedEffort(2.0);
      setSelectedFriendIds([]);
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Build shared members payload if friends selected
    const sharedWith = selectedFriendIds.map((id) => {
      const friendObj = friends.find((f) => f.id === id);
      return {
        id,
        name: friendObj ? friendObj.name : 'Teammate',
        username: friendObj ? friendObj.username : '@teammate',
        status: 'Pending',
      };
    });

    const deadlinePayload = {
      title: title.trim(),
      course: course.trim().toUpperCase() || 'GENERAL',
      courseCode: courseCode.trim().toUpperCase() || '',
      type,
      dueDate,
      dueTime,
      priority,
      estimatedEffort: Number(estimatedEffort) || 2.0,
      notes: notes.trim(),
      sharedWith,
    };

    if (initialData && initialData.id) {
      updateDeadline(initialData.id, deadlinePayload);
    } else {
      addDeadline(deadlinePayload);
    }

    onClose();
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card modal-card--form"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">
              {initialData ? 'Edit Academic Deadline' : 'Add New Deadline'}
            </h2>
            <p className="modal-subtitle">
              {initialData
                ? 'Update deadline specifics and workload calculations.'
                : 'Log a new personal or group academic deliverable.'}
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="deadline-title-input">
              Deliverable Title *
            </label>
            <input
              id="deadline-title-input"
              type="text"
              className="form-input"
              placeholder="e.g. DBMS Group Assignment, Vector Spaces PS4..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Subject & Course Code */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="deadline-course-input">
                Course / Subject *
              </label>
              <input
                id="deadline-course-input"
                type="text"
                className="form-input"
                placeholder="e.g. DBMS, MATHEMATICS"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="deadline-code-input">
                Course Code (Optional)
              </label>
              <input
                id="deadline-code-input"
                type="text"
                className="form-input"
                placeholder="e.g. CS 310, MATH 302"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>
          </div>

          {/* Type & Priority */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="deadline-type-select">
                Deliverable Type
              </label>
              <select
                id="deadline-type-select"
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {DEADLINE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-pill-selector">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`priority-pill-btn priority-pill-btn--${p.id} ${
                      priority === p.id ? 'priority-pill-btn--active' : ''
                    }`}
                    onClick={() => setPriority(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="deadline-date-input">
                Due Date *
              </label>
              <input
                id="deadline-date-input"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="deadline-time-input">
                Due Time
              </label>
              <input
                id="deadline-time-input"
                type="text"
                className="form-input"
                placeholder="e.g. 11:59 PM, 6:00 PM"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          {/* Estimated Effort */}
          <div className="form-group">
            <div className="form-label-with-hint">
              <label className="form-label" htmlFor="deadline-effort-input">
                Estimated Effort (Hours)
              </label>
              <span className="form-hint">Used for Smart Priority and Academic Load</span>
            </div>
            <div className="effort-input-container">
              <input
                id="deadline-effort-input"
                type="number"
                step="0.5"
                min="0.5"
                max="40"
                className="form-input"
                value={estimatedEffort}
                onChange={(e) => setEstimatedEffort(e.target.value)}
                required
              />
              <span className="effort-unit">hours</span>
            </div>
          </div>

          {/* Share with Teammates / Study Group */}
          <div className="form-group">
            <label className="form-label">
              Share with Classmates / Teammates (Optional)
            </label>
            <div className="friend-selector-list">
              {friends.map((friend) => {
                const isSelected = selectedFriendIds.includes(friend.id);
                return (
                  <button
                    key={friend.id}
                    type="button"
                    className={`friend-select-pill ${
                      isSelected ? 'friend-select-pill--selected' : ''
                    }`}
                    onClick={() => toggleFriendSelection(friend.id)}
                  >
                    <span className="friend-select-pill__avatar">
                      {friend.avatar || friend.name.charAt(0)}
                    </span>
                    <span>{friend.name}</span>
                    {isSelected && <span className="friend-select-pill__check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              id="save-deadline-submit-btn"
            >
              {initialData ? 'Update Deadline' : 'Save Deadline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDeadlineModal;
