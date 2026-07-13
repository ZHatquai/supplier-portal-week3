import { useState } from 'react'
import { insertSupplier, newSupplierId } from '../lib/supabase.js'

// The exact GDPR data statement from product-spec.md Section 7 / CLAUDE.md.
// Must be shown verbatim at the point of collection.
export const CONSENT_STATEMENT =
  'Your data will be stored securely and used only to track and manage supplier ' +
  "responses to The Corporate's Sustainability Assessment. You can request " +
  'deletion at any time by contacting info@thecorporate.com.'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Supplier Gate (v3.0) — mandatory identification before either route. Captures
// company name, contact name, contact email, and whether the supplier holds an
// EcoVadis scorecard, plus GDPR consent. On Continue it inserts one `suppliers`
// row (anon, insert-only) and routes: Yes → EcoVadis + on-screen acknowledgement;
// No → Door Selection. A failed insert never routes onward — inline error + retry.
export default function SupplierGate({ onContinue, onEcovadis, onBack }) {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [choice, setChoice] = useState(null) // null | 'yes' | 'no'
  const [consent, setConsent] = useState(false)

  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const errors = {
    companyName: companyName.trim() ? '' : 'Enter your company name.',
    contactName: contactName.trim() ? '' : 'Enter the contact person’s name.',
    contactEmail: !contactEmail.trim()
      ? 'Enter a contact email address.'
      : EMAIL_RE.test(contactEmail.trim())
        ? ''
        : 'Enter a valid email address.',
    choice: choice ? '' : 'Select whether you hold an EcoVadis scorecard.',
    consent: consent ? '' : 'You must agree to the data statement to continue.',
  }
  const isComplete = Object.values(errors).every((e) => !e)

  const err = (key) => (showErrors ? errors[key] : '')

  const handleContinue = async () => {
    setSubmitError('')
    if (!isComplete) {
      setShowErrors(true)
      return
    }
    const hasEcovadis = choice === 'yes'
    setSubmitting(true)

    // Open the EcoVadis tab synchronously (within the click gesture) so it is not
    // caught by a popup blocker after the async insert; we only point it at the
    // real URL once the insert succeeds, and close it if the insert fails.
    let ecoTab = null
    if (hasEcovadis) ecoTab = window.open('about:blank', '_blank')

    const id = newSupplierId()
    const { error } = await insertSupplier({
      id,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      hasEcovadis,
    })
    setSubmitting(false)

    if (error) {
      if (ecoTab) ecoTab.close()
      setSubmitError(
        'We could not record your details just now. Please check your connection and try again.',
      )
      return
    }

    if (hasEcovadis) {
      if (ecoTab) ecoTab.location.href = 'https://ecovadis.com'
      else window.open('https://ecovadis.com', '_blank', 'noopener')
      onEcovadis({ supplierId: id })
    } else {
      onContinue({ supplierId: id })
    }
  }

  return (
    <div className="app-main">
      <button type="button" className="app-backlink" onClick={onBack}>
        ← Back to portal home
      </button>

      <div className="app-view-header">
        <p className="tc-subhead">Supplier Identification</p>
        <h1 className="tc-h2">Tell us who you are.</h1>
        <p className="tc-body mt-md" style={{ color: 'var(--tc-stone)', maxWidth: 620 }}>
          Before you begin, we record who is engaging with the assessment. This applies to every
          supplier, whichever path you take next. It takes under a minute.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Company name */}
        <div className="field">
          <label className="field-label" htmlFor="gate-company">
            Company name <span className="field-required">· Required</span>
          </label>
          <div className={'field-control' + (err('companyName') ? ' invalid' : '')}>
            <input
              id="gate-company"
              className="field-input"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your organisation"
              aria-invalid={!!err('companyName')}
              aria-describedby={err('companyName') ? 'gate-company-error' : undefined}
            />
          </div>
          {err('companyName') && (
            <p className="field-error" id="gate-company-error">{err('companyName')}</p>
          )}
        </div>

        {/* Contact name */}
        <div className="field">
          <label className="field-label" htmlFor="gate-contact">
            Contact person’s name <span className="field-required">· Required</span>
          </label>
          <div className={'field-control' + (err('contactName') ? ' invalid' : '')}>
            <input
              id="gate-contact"
              className="field-input"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full name"
              aria-invalid={!!err('contactName')}
              aria-describedby={err('contactName') ? 'gate-contact-error' : undefined}
            />
          </div>
          {err('contactName') && (
            <p className="field-error" id="gate-contact-error">{err('contactName')}</p>
          )}
        </div>

        {/* Contact email */}
        <div className="field">
          <label className="field-label" htmlFor="gate-email">
            Contact person’s email <span className="field-required">· Required</span>
          </label>
          <div className={'field-control' + (err('contactEmail') ? ' invalid' : '')}>
            <input
              id="gate-email"
              className="field-input"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="name@company.com"
              aria-invalid={!!err('contactEmail')}
              aria-describedby={err('contactEmail') ? 'gate-email-error' : undefined}
            />
          </div>
          {err('contactEmail') && (
            <p className="field-error" id="gate-email-error">{err('contactEmail')}</p>
          )}
        </div>

        {/* EcoVadis Yes/No */}
        <div className="field">
          <span className="field-label" id="gate-eco-label">
            Do you have an EcoVadis scorecard? <span className="field-required">· Required</span>
          </span>
          <div className="gate-toggle" role="radiogroup" aria-labelledby="gate-eco-label">
            <button
              type="button"
              role="radio"
              aria-checked={choice === 'yes'}
              className={'gate-toggle-btn' + (choice === 'yes' ? ' selected' : '')}
              onClick={() => setChoice('yes')}
            >
              Yes
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={choice === 'no'}
              className={'gate-toggle-btn' + (choice === 'no' ? ' selected' : '')}
              onClick={() => setChoice('no')}
            >
              No
            </button>
          </div>
          {err('choice') && <p className="field-error">{err('choice')}</p>}
        </div>

        {/* GDPR consent */}
        <div className="field">
          <label className={'gate-consent' + (err('consent') ? ' invalid' : '')}>
            <input
              type="checkbox"
              className="gate-checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-describedby="gate-consent-statement"
            />
            <span id="gate-consent-statement" className="gate-consent-text">
              {CONSENT_STATEMENT}
            </span>
          </label>
          {err('consent') && <p className="field-error">{err('consent')}</p>}
        </div>
      </form>

      {/* Insert failure — inline, retry-able, never routes onward */}
      {submitError && (
        <div className="gate-submit-error" role="alert">
          {submitError}
        </div>
      )}

      <div className="wizard-nav">
        <button type="button" className="tc-btn-ghost" onClick={onBack}>Back</button>
        <div className="wizard-nav-hint">
          {showErrors && !isComplete
            ? 'Complete every field and agree to the data statement to continue.'
            : 'All fields are required. Your details are stored securely.'}
        </div>
        <button
          type="button"
          className="tc-btn-primary"
          onClick={handleContinue}
          disabled={submitting}
        >
          {submitting ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
