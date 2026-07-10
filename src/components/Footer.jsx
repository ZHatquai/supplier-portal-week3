export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">The Corporate</div>
          <div className="footer-tagline">
            Engineering a sustainable future. Net-Zero by 2045 across all scopes of operation.
          </div>
        </div>
        <div className="footer-meta">
          <div>ESRS / CSRD Aligned · Version 2.0</div>
          <div>Supplier Programme · 2026</div>
          <div style={{ marginTop: 8 }}>
            Scope 3: 71% of total footprint · location-based · 2023 base year
          </div>
          <div style={{ marginTop: 8 }}>
            <a href="mailto:sustainability@thecorporate.com">sustainability@thecorporate.com</a>
          </div>
        </div>
      </div>
      <div className="footer-divider" style={{ margin: '24px 64px' }}></div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2026 The Corporate. Confidential. For Tier 1 Supplier use only.</div>
        <div className="footer-esrs-badge"><span>ESRS Compliant · CSRD 2026</span></div>
      </div>
    </footer>
  )
}
