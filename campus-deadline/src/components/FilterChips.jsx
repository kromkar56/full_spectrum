/**
 * FilterChips - Horizontal row of filter pills matching the Stitch design
 * Active pill has dark background, inactive pills have subtle warm border/fill
 */
function FilterChips({ filters, active, onChange }) {
  return (
    <div className="filter-chips" role="tablist" aria-label="Filter deadlines">
      {filters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            id={`filter-chip-${filter.id}`}
            role="tab"
            aria-selected={isActive}
            className={`chip ${isActive ? 'chip--active' : ''}`}
            onClick={() => onChange(filter.id)}
          >
            {filter.label} ({filter.count})
          </button>
        );
      })}
    </div>
  );
}

export default FilterChips;
