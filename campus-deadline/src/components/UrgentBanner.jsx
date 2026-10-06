import { ZapIcon } from './Icons';

/**
 * UrgentBanner - Dark card highlighting impending deadlines within 24h
 * Replicates the "Immediate Action Horizon" from Google Stitch
 */
function UrgentBanner({ count = 4, onTrackPercent = 87 }) {
  return (
    <section className="urgent-banner" aria-label="Urgent deadlines alert">
      <div className="urgent-banner__top">
        <div className="urgent-banner__label">
          <span className="urgent-banner__icon" aria-hidden="true">
            <ZapIcon />
          </span>
          <span className="urgent-banner__label-text">IMMEDIATE ACTION HORIZON</span>
        </div>
        <span className="urgent-banner__badge" aria-label={`${onTrackPercent}% on track`}>
          {onTrackPercent}% ON TRACK
        </span>
      </div>

      <h2 className="urgent-banner__title">
        {count} deliverables within 24 hours
      </h2>

      <div
        className="urgent-banner__progress-track"
        role="progressbar"
        aria-valuenow={onTrackPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="urgent-banner__progress-fill"
          style={{ width: `${onTrackPercent}%` }}
        />
      </div>
    </section>
  );
}

export default UrgentBanner;
