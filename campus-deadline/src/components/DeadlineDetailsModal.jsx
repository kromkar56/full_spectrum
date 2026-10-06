import React, { useState } from 'react';
import {
  CloseIcon,
  CheckCircleIcon,
  EditIcon,
  TrashIcon,
  ShareIcon,
  ClockIcon,
  FriendsIcon,
  AlertTriangleIcon,
} from './Icons';
import { useApp } from '../context/AppContext';
import { formatDateDisplay, getDeadlineUrgency } from '../utils/dateUtils';

/**
 * DeadlineDetailsModal - Detailed view for an academic deliverable.
 * Displays all core metrics, shared teammate statuses, collision notes,
 * and handles Mark Complete, Edit, Delete (with confirmation), and Share actions.
 */
function DeadlineDetailsModal({ deadline, isOpen, onClose }) {
  const {
    toggleCompleteDeadline,
    deleteDeadline,
    setEditingDeadline,
    setIsAddDeadlineOpen,
    setIsShareModalOpen,
    updateMemberStatus,
    collisionData,
  } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !deadline) return null;

  const {
    id,
    title,
    course,
    courseCode,
    type,
    dueDate,
    dueTime,
    priority,
    estimatedEffort,
    progressPercent = 0,
    isCompleted = false,
    notes,
    sharedWith = [],
  } = deadline;

  const urgency = getDeadlineUrgency(dueDate, isCompleted);
  const formattedDate = formatDateDisplay(dueDate);

  // Check if this deadline is part of a collision cluster
  const isColliding = collisionData.clusters.some((c) => c.date === dueDate);
  const collisionCluster = collisionData.clusters.find((c) => c.date === dueDate);

  const handleToggleComplete = () => {
    toggleCompleteDeadline(id);
  };

  const handleEdit = () => {
    setEditingDeadline(deadline);
    setIsAddDeadlineOpen(true);
    onClose();
  };

  const handleDelete = () => {
    deleteDeadline(id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleMemberStatusCycle = (username, currentStatus) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'Acknowledged'
        : currentStatus === 'Acknowledged'
        ? 'Completed'
        : 'Pending';
    updateMemberStatus(id, username, nextStatus);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card modal-card--details"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="details-title"
      >
        {/* Top Header */}
        <div className="modal-header">
          <div className="details-header-meta">
            <span className="details-course-pill">
              {course} {courseCode ? `· ${courseCode}` : ''}
            </span>
            <span className={`details-status-badge ${isCompleted ? 'details-status-badge--done' : urgency.isUrgent ? 'details-status-badge--urgent' : ''}`}>
              {urgency.label}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </div>

        {/* Deliverable Title & Priority */}
        <div className="details-hero">
          <h2 id="details-title" className={`details-title ${isCompleted ? 'details-title--completed' : ''}`}>
            {title}
          </h2>

          <div className="details-meta-row">
            <span className="details-type-badge">{type || 'Assignment'}</span>
            <span className={`details-priority-badge details-priority-badge--${priority}`}>
              {priority ? `${priority.toUpperCase()} PRIORITY` : 'NORMAL'}
            </span>
            <span className="details-effort-badge">
              <ClockIcon /> {estimatedEffort || 2}h estimated effort
            </span>
          </div>
        </div>

        {/* Collision Alert if clustered with other tasks */}
        {isColliding && !isCompleted && (
          <div className="details-collision-alert">
            <AlertTriangleIcon />
            <div className="details-collision-text">
              <strong>Deadline Collision Warning:</strong> {collisionCluster?.count} deadlines are clustered on {formattedDate}. Consider starting this deliverable early to defuse pressure.
            </div>
          </div>
        )}

        {/* Due Date & Time Card */}
        <div className="details-card-box">
          <div className="details-info-grid">
            <div className="details-info-item">
              <span className="details-info-label">DUE DATE</span>
              <span className="details-info-val">{formattedDate}</span>
            </div>
            <div className="details-info-item">
              <span className="details-info-label">DUE TIME</span>
              <span className="details-info-val">{dueTime || '11:59 PM'}</span>
            </div>
            <div className="details-info-item">
              <span className="details-info-label">WORKLOAD IMPACT</span>
              <span className="details-info-val">
                {Number(estimatedEffort) >= 3 ? 'High Impact' : 'Standard'}
              </span>
            </div>
            <div className="details-info-item">
              <span className="details-info-label">STATUS</span>
              <span className="details-info-val">
                {isCompleted ? 'Completed' : urgency.status}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="details-progress-section">
            <div className="details-progress-header">
              <span>Current Progress</span>
              <strong>{isCompleted ? 100 : progressPercent}%</strong>
            </div>
            <div className="deadline-card__progress-track">
              <div
                className="deadline-card__progress-fill"
                style={{ width: `${isCompleted ? 100 : progressPercent}%` }}
              />
            </div>
          </div>

          {notes && (
            <div className="details-notes-box">
              <span className="details-info-label">SPECIFICATIONS & NOTES</span>
              <p className="details-notes-text">{notes}</p>
            </div>
          )}
        </div>

        {/* Shared Teammates Section */}
        <div className="details-shared-section">
          <div className="details-shared-header">
            <div className="details-shared-title">
              <FriendsIcon />
              <span>Study Group / Teammates ({sharedWith.length})</span>
            </div>
            <button
              className="details-share-btn"
              onClick={handleShareClick}
              title="Add or manage shared teammates"
            >
              <ShareIcon /> <span>{sharedWith.length > 0 ? 'Manage Sharing' : 'Share with Friends'}</span>
            </button>
          </div>

          {sharedWith.length > 0 ? (
            <div className="details-members-list">
              {sharedWith.map((member) => (
                <div key={member.username} className="details-member-item">
                  <div className="details-member-info">
                    <span className="details-member-avatar">
                      {member.name.charAt(0)}
                    </span>
                    <div>
                      <div className="details-member-name">{member.name}</div>
                      <div className="details-member-user">{member.username}</div>
                    </div>
                  </div>

                  <button
                    className={`member-status-pill member-status-pill--${member.status?.toLowerCase() || 'pending'}`}
                    onClick={() => handleMemberStatusCycle(member.username, member.status)}
                    title="Click to cycle status (Pending -> Acknowledged -> Completed)"
                  >
                    {member.status || 'Pending'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="details-shared-empty">
              Personal deliverable (Private). Share with teammates to track group progress.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="details-actions">
          <button
            className={`btn ${isCompleted ? 'btn--secondary' : 'btn--primary'} details-complete-btn`}
            onClick={handleToggleComplete}
            id="details-toggle-complete-btn"
          >
            <CheckCircleIcon />
            <span>{isCompleted ? 'Reopen Deadline' : 'Mark Completed on Time'}</span>
          </button>

          <div className="details-secondary-actions">
            <button
              className="btn-icon-text"
              onClick={handleEdit}
              title="Edit deadline"
              id="details-edit-btn"
            >
              <EditIcon /> <span>Edit</span>
            </button>

            <button
              className="btn-icon-text btn-icon-text--danger"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete deadline"
              id="details-delete-btn"
            >
              <TrashIcon /> <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
              <h4>Delete Deadline?</h4>
              <p>
                Are you sure you want to delete "{title}"? This will remove it from your
                academic schedule and workload metrics.
              </p>
              <div className="delete-confirm-actions">
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={handleDelete}
                  id="confirm-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeadlineDetailsModal;
