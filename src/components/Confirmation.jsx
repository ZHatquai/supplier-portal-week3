import Footer from './Footer.jsx'
import AnswersReview from './AnswersReview.jsx'

// Confirmation — on-screen only, after either door. States plainly that no email
// is sent and nothing is stored. Closing the tab clears the session.
export default function Confirmation({ submission, onHome }) {
  const sourceLabel =
    submission.source === 'door1'
      ? 'the guided form (Door 1)'
      : 'an uploaded file (Door 2)'

  return (
    <>
      <div className="app-main">
        <div className="confirm-banner">
          <div className="confirm-banner-eyebrow">Submission received on screen</div>
          <div className="confirm-banner-title">Your questionnaire is complete.</div>
          <div className="confirm-banner-body">
            Thank you. Your responses were captured through {sourceLabel} and are summarised below.
            This is the end of the assessment flow for this version of the portal.
          </div>
        </div>

        <div className="confirm-note">
          <strong>No email is sent and nothing is stored.</strong> Your answers were held in this
          browser session only. There was no server, no database, and no upload of your data.
          Closing this tab clears the session and your answers cannot be retrieved. If you need a
          record, take a copy of the summary below before you close the tab.
        </div>

        <p className="tc-subhead mb-md">Your submitted answers</p>
        <AnswersReview answers={submission.answers} notes={submission.notes} />

        <div className="wizard-nav">
          <div className="wizard-nav-hint">Closing the tab ends the session.</div>
          <button type="button" className="tc-btn-secondary" onClick={onHome}>Return to portal home</button>
        </div>
      </div>
      <Footer />
    </>
  )
}
