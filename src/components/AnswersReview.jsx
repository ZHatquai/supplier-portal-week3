import { SECTIONS } from '../data/questionnaire.js'

// Lays out answers by section S1–S7, mirroring the questionnaire. Blank or
// missing answers are shown as empty so the gaps are visible. Shared by the
// Door 2 Review screen and the Confirmation screen (both doors).
export default function AnswersReview({ answers = {}, notes = {} }) {
  return (
    <div>
      {SECTIONS.map((section) => (
        <div className="answers-section" key={section.id}>
          <div className="answers-section-head">
            <span className="answers-section-id">{section.id}</span>
            <span className="answers-section-title">{section.title}</span>
            <span className="answers-section-ref">{section.esrs}</span>
          </div>

          {section.questions.map((q) => {
            const raw = (answers[q.id] ?? '').toString().trim()
            const note = (notes[q.id] ?? '').toString().trim()
            const hasValue = raw !== ''
            return (
              <div className="answer-row" key={q.id}>
                <div className="answer-q">
                  <span className="field-ref">{q.ref}</span>
                  {q.label}
                </div>
                {hasValue ? (
                  <div className="answer-a">
                    {raw}
                    {q.input === 'number' && q.unit && <span className="answer-unit">{q.unit}</span>}
                  </div>
                ) : (
                  <div className="answer-a empty">Not provided</div>
                )}
                {note && (
                  <div className="answer-notes">
                    <span className="answer-notes-label">Notes</span>
                    {note}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
