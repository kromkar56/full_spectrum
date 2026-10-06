import {
  HomeGridIcon,
  DeadlineNavIcon,
  InsightsNavIcon,
  FriendsIcon,
} from './Icons';

// Navigation items configuration matching Full Spectrum rulebook
const NAV_ITEMS = [
  { id: 'home',      label: 'Home',      Icon: HomeGridIcon },
  { id: 'deadlines', label: 'Deadlines', Icon: DeadlineNavIcon },
  { id: 'insights',  label: 'Insights',  Icon: InsightsNavIcon },
  { id: 'friends',   label: 'Friends',   Icon: FriendsIcon },
];

/**
 * BottomNav - Persistent bottom bar matching Google Stitch prototype
 * 4 primary sections: Home, Deadlines, Insights, Friends.
 * Profile is accessible via top avatar in Header as per Rulebook specification.
 */
function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav__inner">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <span className={`nav-item__icon ${isActive ? 'nav-item__icon--active' : ''}`}>
                <Icon active={isActive} />
              </span>
              <span className={`nav-item__label ${isActive ? 'nav-item__label--active' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="nav-item__dot" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
