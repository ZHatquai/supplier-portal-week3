import Footer from './Footer.jsx'

// EcoVadis acknowledgement — shown in the portal tab after a Yes at the Gate.
// ecovadis.com has already been opened in a new tab; this view confirms the
// record was saved and does not navigate further. A visible link is kept as a
// reliable fallback in case the new tab was blocked.
export default function EcovadisAck({ onHome }) {
  return (
    <>
      <div className="app-main">
        <div className="confirm-banner">
          <div className="confirm-banner-eyebrow">EcoVadis path</div>
          <div className="confirm-banner-title">Your information has been recorded.</div>
          <div className="confirm-banner-body">
            Complete your scorecard on EcoVadis. We opened it in a new tab — if it did not open,
            use the link below. Our Procurement team will be in touch to confirm your status.
          </div>
        </div>

        <div className="wizard-nav">
          <a
            href="https://ecovadis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="tc-btn-primary"
            style={{ textAlign: 'center' }}
          >
            Open EcoVadis
          </a>
          <div className="wizard-nav-hint">
            No email is sent and nothing further happens in this tab. Closing it clears the session.
          </div>
          <button type="button" className="tc-btn-secondary" onClick={onHome}>
            Return to portal home
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
