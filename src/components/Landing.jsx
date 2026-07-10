import { useState } from 'react'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

// The v1.0 landing content, ported verbatim into React. Two mandated changes:
//  • Route A (EcoVadis) CTA opens ecovadis.com in a new tab.
//  • Route B (questionnaire) CTA reads "Complete the Questionnaire" and opens
//    the in-portal Door Selection; the v1.0 email-return copy is removed.
export default function Landing({ onComplete, onHome }) {
  const [choice, setChoice] = useState(null) // null | 'yes' | 'no'

  return (
    <>
      <Nav onHome={onHome} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-tag"><span>Supplier Programme 2026</span></div>
            <div className="hero-eyebrow-line"></div>
          </div>

          <h1 className="hero-title">
            We don't just manufacture products.<br />We <em>engineer</em> a sustainable future.
          </h1>

          <p className="hero-body">
            Our 2045 Net-Zero goal is a shared journey. This portal is your starting point —
            understand what we are asking, why it matters, and which submission path applies to you.
          </p>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">690,000</div>
              <div className="hero-stat-label">tCO2e Total Footprint (2023)</div>
            </div>
            <div>
              <div className="hero-stat-value">71%</div>
              <div className="hero-stat-label">Scope 3 — Value Chain</div>
            </div>
            <div>
              <div className="hero-stat-value">2045</div>
              <div className="hero-stat-label">Net-Zero Target Year</div>
            </div>
            <div>
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Tier 1 Suppliers</div>
            </div>
          </div>
          <p
            className="hero-stat-note"
            style={{ marginTop: 16, fontSize: 12, color: 'var(--tc-stone)', letterSpacing: '0.04em' }}
          >
            Scope 3 is 71% of The Corporate's total carbon footprint (location-based, 2023 base year).
          </p>
        </div>
      </section>

      {/* ── THE WHY ───────────────────────────────────────────────────────── */}
      <section className="section-why" id="why">
        <div className="tc-page">
          <p className="tc-subhead mb-lg">Why We Are Asking</p>
          <div className="why-grid">
            <div className="why-left">
              <h2 className="tc-h2" style={{ maxWidth: 440 }}>
                This is driven by regulation, and by ambition.
              </h2>
              <p className="tc-body mt-lg" style={{ color: 'var(--tc-stone)' }}>
                71% of The Corporate's total carbon footprint sits in our value chain — in the
                products and services our Tier 1 suppliers provide. Reaching Net-Zero by 2045 is
                not possible without visibility into, and collaboration with, our supply base.
              </p>
              <p className="tc-body mt-md" style={{ color: 'var(--tc-stone)' }}>
                This assessment is the foundation of that visibility. It is aligned with the EU's
                Corporate Sustainability Reporting Directive (CSRD) and the European Sustainability
                Reporting Standards (ESRS), both of which require companies to report on value chain
                impacts beginning in 2026.
              </p>
            </div>
            <div className="why-right">
              <div className="why-card">
                <div className="why-card-tag"><span>CSRD / ESRS</span></div>
                <div className="why-card-title">Regulatory Requirement</div>
                <div className="why-card-body">
                  The EU Corporate Sustainability Reporting Directive mandates disclosure of Scope 3
                  emissions and value chain sustainability performance. Non-compliance creates
                  material financial and reputational risk for The Corporate — and by extension, for
                  you.
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-tag"><span>Double Materiality</span></div>
                <div className="why-card-title">Impact &amp; Financial Materiality</div>
                <div className="why-card-body">
                  Our 2026 Double Materiality Assessment identified three primary supplier risk
                  areas: E1 (Climate), E2 (PFAS / Pollution), and E3 (Water Stress). These are not
                  hypothetical risks — they carry direct financial exposure in the form of carbon
                  taxes, REACH bans, and supply chain disruptions.
                </div>
              </div>
              <div className="why-card">
                <div className="why-card-tag"><span>Partnership</span></div>
                <div className="why-card-title">A Shared Journey</div>
                <div className="why-card-body">
                  Suppliers who demonstrate strong sustainability performance receive preferential
                  status in The Corporate's procurement scoring. This is not a compliance exercise —
                  it is the foundation of a long-term, resilient supply partnership.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO ROUTES ────────────────────────────────────────────────────── */}
      <section className="section-tree" id="submit">
        <div className="tc-page">
          <div className="tree-header">
            <p className="tc-subhead mb-md">Your Submission Path</p>
            <h2 className="tc-h2">Two routes. One destination.</h2>
            <p className="tc-body mt-md" style={{ color: 'var(--tc-stone)', fontSize: 14 }}>
              We respect your time. If you already hold a current EcoVadis Scorecard, you have an
              expedited path. Answer the question below to find out where to start.
            </p>
          </div>

          {/* Qualification question */}
          <div className="tree-question-card">
            <div className="tree-question-label">Step 1 of 2 — Qualification Check</div>
            <div className="tree-question-text">
              Do you hold a valid EcoVadis Scorecard issued within the last 12 months?
            </div>
            <div className="tree-btn-group">
              <button
                type="button"
                className="tree-btn tree-btn-yes"
                onClick={() => setChoice('yes')}
              >
                Yes, I Have a Scorecard
              </button>
              <button
                type="button"
                className="tree-btn tree-btn-no"
                onClick={() => setChoice('no')}
              >
                No, I Don't
              </button>
            </div>
          </div>

          {/* Connector */}
          <div className="tree-connector" style={{ display: choice ? 'flex' : 'none' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>

          {/* Two paths */}
          <div className="tree-paths">
            {/* Path A — EcoVadis */}
            <div
              className={
                'tree-path' +
                (choice === 'yes' ? ' highlighted' : '') +
                (choice === 'no' ? ' dimmed' : '')
              }
            >
              <div className="tree-path-badge"><span>Path A — EcoVadis</span></div>
              <div className="tree-path-title">Submit Your Scorecard</div>
              <div className="tree-path-body">
                Suppliers with a current EcoVadis Scorecard (score ≥ 45) are exempt from the detailed
                technical questionnaire. Simply submit your scorecard and our Procurement team will be
                in touch to confirm your status.
                <br /><br />
                Estimated time: <strong style={{ color: 'var(--tc-ink)', fontWeight: 500 }}>5 minutes</strong>
              </div>
              <a
                href="https://ecovadis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="tc-btn-primary"
                style={{ width: '100%', textAlign: 'center', display: 'block', padding: 14 }}
              >
                Submit EcoVadis Scorecard
              </a>
            </div>

            {/* Path B — Full Assessment */}
            <div
              className={
                'tree-path' +
                (choice === 'no' ? ' highlighted' : '') +
                (choice === 'yes' ? ' dimmed' : '')
              }
            >
              <div className="tree-path-badge badge-b"><span>Path B — Full Assessment</span></div>
              <div className="tree-path-title">Complete the Questionnaire</div>
              <div className="tree-path-body">
                Complete the Smart Sustainability Questionnaire covering sections aligned to ESRS E1,
                E2, E3, E4, E5, S2, and G1. Fill it in guided section by section, or download it,
                complete it offline, and upload it back — all in the browser.
                <br /><br />
                Estimated time: <strong style={{ color: 'var(--tc-ink)', fontWeight: 500 }}>45–60 minutes</strong>
              </div>
              <button
                type="button"
                className="tc-btn-secondary"
                style={{ width: '100%', textAlign: 'center', display: 'block', padding: 14 }}
                onClick={onComplete}
              >
                Complete the Questionnaire
              </button>
            </div>
          </div>

          {/* Reset */}
          <div className={'tree-reset' + (choice ? ' visible' : '')}>
            <button type="button" onClick={() => setChoice(null)}>Start Over</button>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <section className="section-timeline" id="timeline">
        <div className="tc-page">
          <p className="tc-subhead mb-md">Programme Timeline</p>
          <h2 className="tc-h2">What happens next.</h2>

          <div className="timeline mt-xl">
            <div className="timeline-step active">
              <div className="timeline-step-num">01</div>
              <div className="timeline-step-title">Portal Launch</div>
              <div className="timeline-step-body">You receive this link and select your submission path.</div>
              <div className="timeline-step-date">April 2026</div>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-num">02</div>
              <div className="timeline-step-title">Data Submission</div>
              <div className="timeline-step-body">Submit scorecard or complete questionnaire. 100% Tier 1 response required.</div>
              <div className="timeline-step-date">Deadline: 30 Sep 2026</div>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-num">03</div>
              <div className="timeline-step-title">Review &amp; Scoring</div>
              <div className="timeline-step-body">Our EHS and Procurement teams review submissions and flag gaps.</div>
              <div className="timeline-step-date">Q4 2026</div>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-num">04</div>
              <div className="timeline-step-title">Partnership Plans</div>
              <div className="timeline-step-body">Joint decarbonisation and improvement plans agreed with prioritised suppliers.</div>
              <div className="timeline-step-date">Q1 2027</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY RESOURCES ─────────────────────────────────────────────────── */}
      <section className="section-links" id="resources">
        <div className="tc-page">
          <p className="tc-subhead mb-md">Key Resources</p>
          <h2 className="tc-h2">Everything you need.</h2>

          <div className="links-grid">
            <a
              href="/assets/The_Corporate_Supplier_Code_of_Conduct_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
            >
              <div className="link-card-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </div>
              <div className="link-card-label">Document</div>
              <div className="link-card-title">Supplier Code of Conduct</div>
              <div className="link-card-desc">
                Our standards for ethical business conduct, labour rights, and environmental
                responsibility. All Tier 1 suppliers must have a signed copy on file.
              </div>
              <div className="link-card-arrow">
                View Document
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </div>
            </a>

            <a
              href="/assets/The_Corporate_Global_Environmental_Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
            >
              <div className="link-card-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <div className="link-card-label">Policy</div>
              <div className="link-card-title">Global Environmental Policy</div>
              <div className="link-card-desc">
                The Corporate's commitments on climate, water, PFAS, and circular economy — the
                framework that defines what we expect from our value chain partners.
              </div>
              <div className="link-card-arrow">
                View Policy
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </div>
            </a>

            <a
              href="mailto:sustainability@thecorporate.com?subject=Supplier Portal Help Desk Query"
              className="link-card"
            >
              <div className="link-card-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </div>
              <div className="link-card-label">Support</div>
              <div className="link-card-title">EHS Help Desk</div>
              <div className="link-card-desc">
                Questions about specific ESRS requirements, measurement methodology, or technical
                aspects of the questionnaire? Contact our Environment, Health &amp; Safety team
                directly.
              </div>
              <div className="link-card-arrow">
                Contact EHS
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
