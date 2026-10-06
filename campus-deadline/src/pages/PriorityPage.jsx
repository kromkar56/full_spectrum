import InsightsPage from './InsightsPage';

/**
 * PriorityPage - Re-exports InsightsPage to unify Smart Priority,
 * Early-Warning Radar, and Workload Analytics under a single coherent view.
 */
function PriorityPage() {
  return <InsightsPage />;
}

export default PriorityPage;
