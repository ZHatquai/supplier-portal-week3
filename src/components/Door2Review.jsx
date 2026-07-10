import AnswersReview from './AnswersReview.jsx'

// Door 2 — Review. Shows what was parsed from a structurally matching file,
// blanks shown as empty, before the supplier submits. They can go back to
// re-upload a corrected file.
export default function Door2Review({ result, onSubmit, onReupload }) {
  return (
    <div className="app-main">
      <button type="button" className="app-backlink" onClick={onReupload}>← Back to upload a different file</button>

      <div className="app-view-header">
        <p className="tc-subhead">Door 2 · Review</p>
        <h1 className="tc-h2">Review what we read from your file.</h1>
        <p className="tc-body mt-md" style={{ color: 'var(--tc-stone)', maxWidth: 620 }}>
          The file <strong style={{ fontWeight: 500, color: 'var(--tc-ink)' }}>{result.fileName}</strong>{' '}
          matched the 2026 template. Check the answers below. Blank cells are shown as empty. Nothing
          is submitted until you choose to.
        </p>
      </div>

      <AnswersReview answers={result.answers} notes={result.notes} />

      <div className="wizard-nav">
        <button type="button" className="tc-btn-ghost" onClick={onReupload}>Upload a different file</button>
        <div className="wizard-nav-hint">Blank answers are accepted. Submit when the review looks right.</div>
        <button type="button" className="tc-btn-primary" onClick={onSubmit}>Submit questionnaire</button>
      </div>
    </div>
  )
}
