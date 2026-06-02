export default function LoadingSkeleton({ label, lines = 4 }) {
  return (
    <div className="loading-skeleton" aria-live="polite">
      <div className="skeleton-label">{label}</div>
      <div className="skeleton-grid">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="skeleton-line" />
        ))}
      </div>
    </div>
  )
}
