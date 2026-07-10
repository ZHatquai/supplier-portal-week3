import { isRequired } from '../data/questionnaire.js'

// Renders one questionnaire field for Door 1, driven entirely by the derived
// question definition (input type, dropdown options, unit, required rule).
export default function Field({ question, value, error, answers, onChange, showError }) {
  const required = isRequired(question, answers)
  const shownError = showError ? error : ''
  const errorId = `${question.id}-error`
  const controlClass = 'field-control' + (shownError ? ' invalid' : '')

  return (
    <div className="field">
      <label className="field-label" htmlFor={question.id}>
        <span className="field-ref">{question.ref}</span>
        {question.label}{' '}
        {required ? (
          <span className="field-required">· Required</span>
        ) : (
          <span className="field-optional">· Optional</span>
        )}
      </label>

      {question.help && (
        <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--tc-stone)', lineHeight: 1.6, margin: '-4px 0 10px' }}>
          {question.help}
        </p>
      )}

      <div className={controlClass}>
        {question.input === 'select' && (
          <select
            id={question.id}
            className="field-select"
            value={value || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            aria-invalid={!!shownError}
            aria-describedby={shownError ? errorId : undefined}
          >
            <option value="">Select…</option>
            {question.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {question.input === 'textarea' && (
          <textarea
            id={question.id}
            className="field-textarea"
            value={value || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder="Type your answer"
            aria-invalid={!!shownError}
            aria-describedby={shownError ? errorId : undefined}
          />
        )}

        {question.input === 'number' && (
          <>
            <input
              id={question.id}
              className="field-input"
              type="text"
              inputMode="decimal"
              value={value || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              placeholder="0"
              aria-invalid={!!shownError}
              aria-describedby={shownError ? errorId : undefined}
            />
            {question.unit && <span className="field-unit">{question.unit}</span>}
          </>
        )}

        {question.input === 'text' && (
          <input
            id={question.id}
            className="field-input"
            type="text"
            value={value || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder="Type your answer"
            aria-invalid={!!shownError}
            aria-describedby={shownError ? errorId : undefined}
          />
        )}
      </div>

      {shownError && (
        <p className="field-error" id={errorId}>{shownError}</p>
      )}
    </div>
  )
}
