import { SearchIcon } from './Icons';

/**
 * SearchBar - Full-width rounded search input.
 * Allows filtering deadlines by course code or title.
 */
function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        <SearchIcon />
      </span>
      <input
        id="deadline-search"
        className="search-bar__input"
        type="search"
        placeholder="Search by course (e.g. MATH) or deliverable title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search deadlines"
      />
    </div>
  );
}

export default SearchBar;
