import { useState } from 'react'
import Field from './Field.jsx'
import {
  SECTIONS,
  validateSection,
  validateField,
  isBypassed,
  BYPASS_YES,
} from '../data/questionnaire.js'

// Door 1 — the guided S1→S7 wizard. A section cannot advance, and the
// questionnaire cannot submit, while a required field is missing or a value is
// invalid. Validation messages appear inline.
export default function Door1Wizard({ answers, onChange, onSubmit, onBack }) {
  const [index, setIndex] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const section = SECTIONS[index]
  const isLast = index === SECTIONS.length - 1
  const bypassed = isBypassed(answers)
  const sectionErrors = validateSection(section, answers)

  const goNext = () => {
    if (Object.keys(sectionErrors).length > 0) {
      setShowErrors(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setShowErrors(false)
    setIndex((i) => Math.min(i + 1, SECTIONS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setShowErrors(false)
    if (index === 0) {
      onBack()
      return
    }
    setIndex((i) => Math.max(i - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = () => {
    // Validate every section — the bypass choice can change what is required.
    for (let i = 0; i < SECTIONS.length; i++) {
      if (Object.keys(validateSection(SECTIONS[i], answers)).length > 0) {
        setIndex(i)
        setShowErrors(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }
    onSubmit(answers)
  }

  return (
    <div className="app-main">
      <button type="button" className="app-backlink" onClick={onBack}>← Back to submission choice</button>

      {/* Progress across S1–S7 */}
      <div className="wizard-progress" aria-label="Section progress">
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            className={'wizard-progress-step' + (i < index ? ' done' : '') + (i === index ? ' current' : '')}
          >
            <div className="wizard-progress-bar"></div>
            <div className="wizard-progress-label">{s.id}</div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div>
        <div className="wizard-section-eyebrow">Section {index + 1} of {SECTIONS.length}</div>
        <h1 className="wizard-section-title">{section.id} · {section.title}</h1>
        <div className="wizard-section-ref">{section.esrs}</div>
      </div>

      {/* Bypass notice on S2–S7 */}
      {bypassed && index > 0 && (
        <div className="wizard-notice">
          <strong>EcoVadis bypass selected.</strong> You confirmed a valid EcoVadis Scorecard in S1,
          so sections S2–S7 are optional. Add detail if you wish, or submit at any time.
        </div>
      )}

      {/* Fields */}
      <form onSubmit={(e) => e.preventDefault()}>
        {section.questions.map((q) => (
          <Field
            key={q.id}
            question={q}
            value={answers[q.id]}
            error={validateField(q, answers[q.id], answers)}
            answers={answers}
            onChange={onChange}
            showError={showErrors}
          />
        ))}
      </form>

      {/* Navigation */}
      <div className="wizard-nav">
        <button type="button" className="tc-btn-ghost" onClick={goBack}>
          {index === 0 ? 'Back' : `Back to ${SECTIONS[index - 1].id}`}
        </button>
        <div className="wizard-nav-hint">
          {showErrors && Object.keys(sectionErrors).length > 0
            ? 'Resolve the highlighted fields to continue.'
            : bypassed && index > 0
              ? 'Optional under EcoVadis bypass.'
              : 'Required fields must be complete to continue.'}
        </div>
        {isLast ? (
          <button type="button" className="tc-btn-primary" onClick={submit}>Submit questionnaire</button>
        ) : (
          <button type="button" className="tc-btn-primary" onClick={goNext}>Next · {SECTIONS[index + 1].id}</button>
        )}
      </div>
    </div>
  )
}
