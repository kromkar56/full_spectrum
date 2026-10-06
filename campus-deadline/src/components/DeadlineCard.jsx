import { ClockIcon, CheckCircleIcon, FriendsIcon } from './Icons';
import { formatDateDisplay, getDeadlineUrgency } from '../utils/dateUtils';
import { useApp } from '../context/AppContext';

/**
 * DeadlineCard - Core assignment item replicating Google Stitch prototype.
 * Includes course metadata, priority badge, relative due countdown,
 * progress bar, estimated effort, shared teammate badge, and actions.
 */
function DeadlineCard({ deadline, onOpenDetails, onQuickComplete }) {
  const { toggleCompleteDeadline } = useApp();

  const {
    id,
    course,
    courseCode,
    title,
    type,
    dueDate,
    dueTime,
    progressPercent = 0,
    estimatedEffort = 2,
    priority,
    isCompleted = false,
    sharedWith = [],
  } = deadline;

  const urgency = getDeadlineUrgency(dueDate, isCompleted);
  const formattedDate = formatDateDisplay(dueDate);

  const handleCompleteClick = (e) => {
    e.stopPropagation();
    if (onQuickComplete) {
      onQuickComplete(id);
    } else {
      toggleCompleteDeadline(id);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(deadline);
    }
  };

  return (
    <article
      className={`deadline-card ${isCompleted ? 'deadline-card--completed' : ''}`}
      aria-labelledby={`deadline-title-${id}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Course metadata & Priority tag */}
      <div className="deadline-card__meta">
        <div className="deadline-card__tags">
          <span className="deadline-card__course">
            {course || 'COURSE'} {courseCode ? `· ${courseCode}` : ''}
          </span>
          {type && <span className="deadline-card__type-tag">{type}</span>}
        </div>

        <div className="deadline-card__badges">
          {priority === 'high' && (
            <span className="deadline-card__priority deadline-card__priority--high" aria-label="High priority">
              <span className="deadline-card__priority-dot" aria-hidden="true" />
              HIGH PRIORITY
            </span>
          )}
          {priority === 'medium' && (
            <span className="deadline-card__priority deadline-card__priority--med" aria-label="Medium priority">
              MEDIUM
            </span>
          )}
          {sharedWith && sharedWith.length > 0 && (
            <span className="deadline-card__shared-pill" title={`Shared with ${sharedWith.length} teammates`}>
              <FriendsIcon />
              <span>{sharedWith.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* Deliverable title */}
      <h3 id={`deadline-title-${id}`} className="deadline-card__title">
        {title}
      </h3>

      {/* Due timestamp */}
      <div className="deadline-card__due">
        <span
          className={`deadline-card__due-label ${
            urgency.isUrgent ? 'deadline-card__due-label--urgent' : ''
          }`}
        >
          {urgency.label}
        </span>
        {formattedDate && <span className="deadline-card__due-date">· {formattedDate}</span>}
        {dueTime && <span className="deadline-card__due-time">· {dueTime}</span>}
      </div>

      {/* Embedded progress indicator box */}
      <div className="deadline-card__progress-box">
        <div className="deadline-card__progress-header">
          <span className="deadline-card__progress-label">
            {isCompleted ? 'Completed' : progressPercent > 70 ? 'Final Review stage' : progressPercent > 30 ? 'In Progress' : 'Initial Draft'}
          </span>
          <span className="deadline-card__progress-pct">{isCompleted ? 100 : progressPercent}%</span>
        </div>
        <div
          className="deadline-card__progress-track"
          role="progressbar"
          aria-valuenow={isCompleted ? 100 : progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="deadline-card__progress-fill"
            style={{ width: `${isCompleted ? 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card footer: estimated remaining effort and Actions */}
      <div className="deadline-card__footer">
        <div className="deadline-card__time-remaining">
          <ClockIcon />
          <span>{estimatedEffort}h effort</span>
        </div>

        <div className="deadline-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            id={`complete-btn-${id}`}
            className={`complete-toggle-btn ${isCompleted ? 'complete-toggle-btn--done' : ''}`}
            onClick={handleCompleteClick}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircleIcon />
            <span>{isCompleted ? 'Completed' : 'Complete'}</span>
          </button>

          <button
            id={`open-details-${id}`}
            className="submit-btn"
            onClick={handleCardClick}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export default DeadlineCard;
