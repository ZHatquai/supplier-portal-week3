const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function DoorSelection({ onDoor1, onDoor2, onBack }) {
  return (
    <div className="app-main">
      <button type="button" className="app-backlink" onClick={onBack}>← Back to portal home</button>

      <div className="app-view-header">
        <p className="tc-subhead">Complete the Questionnaire</p>
        <h1 className="tc-h2">Choose how you would like to submit.</h1>
        <p className="tc-body mt-md" style={{ color: 'var(--tc-stone)', maxWidth: 620 }}>
          Both routes cover the same seven sections, S1 to S7. Fill the form in the browser, or
          download the workbook, complete it offline, and upload it back for review. Nothing is
          stored and nothing is sent.
        </p>
      </div>

      <div className="door-grid">
        <button type="button" className="door-card" onClick={onDoor1}>
          <div className="door-card-num">01</div>
          <div className="door-card-title">Fill in the portal</div>
          <div className="door-card-body">
            Answer the questionnaire section by section in a guided form. Dropdowns, number fields,
            and required markers are built in, with inline checks before each step.
          </div>
          <span className="door-card-cta">Start the guided form <ArrowRight /></span>
        </button>

        <button type="button" className="door-card" onClick={onDoor2}>
          <div className="door-card-num">02</div>
          <div className="door-card-title">Download and upload</div>
          <div className="door-card-body">
            Download the 2026 workbook, complete it offline in Excel, and upload the finished file.
            The portal parses it in the browser and shows you a review before you submit.
          </div>
          <span className="door-card-cta">Download and upload <ArrowRight /></span>
        </button>
      </div>
    </div>
  )
}
