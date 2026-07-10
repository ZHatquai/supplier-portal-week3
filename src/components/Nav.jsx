export default function Nav({ onHome }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button type="button" className="nav-logo" aria-label="The Corporate — home" onClick={onHome}>
          <div className="nav-logo-mark"><span>C</span></div>
          <span className="nav-logo-wordmark">The Corporate</span>
        </button>
        <span className="nav-meta">Supplier Sustainability Portal · 2026</span>
      </div>
    </nav>
  )
}
