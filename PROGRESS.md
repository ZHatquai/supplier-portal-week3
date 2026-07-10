# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 0 — build not started
**Last updated:** 10 July 2026 — by Project Governor, pre-build
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
The v1.0 static HTML landing page (supplier_onboarding.html) exists in the repo and is the source for the ported landing content. Repo also contains CLAUDE.md, PROGRESS.md, product-spec.md, the-corporate-brand brand file (installed in session 1), and The_Corporate_Supplier_Questionnaire_2026.xlsx in the assets folder. Nothing in the React rebuild is built yet.
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
None — the first build session has not happened yet.
[Rule: 3 to 5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] First Session Setup: create docs/, move product-spec.md, install the the-corporate-brand skill, commit (see CLAUDE.md Session Protocol)
- [ ] Inspect The_Corporate_Supplier_Questionnaire_2026.xlsx and derive the S1 to S7 field structure (labels, sections, input types, dropdown lists, units, required flags) used by both Door 1 and the Door 2 parser
- [ ] Build Landing Page — port all v1.0 content verbatim from supplier_onboarding.html; amend the Route 2 card (CTA "Complete the Questionnaire", remove the email-return copy)
- [ ] Build Door Selection — two option cards (fill in the portal / download and upload) plus a back path to the landing page
- [ ] Build Door 1 — the guided S1 to S7 wizard with per-section validation and inline messages
- [ ] Build Door 2 — Download and Upload: workbook download, upload control accepting .xlsx or .csv, client-side parsing
- [ ] Build Door 2 — Review / Rejection: parsed answers by section with blanks shown as empty, or a rejection message naming what did not match
- [ ] Build Confirmation — summary of submitted answers by section, on-screen only, states no email and no storage
- [ ] Wire the workbook download: serve The_Corporate_Supplier_Questionnaire_2026.xlsx as a static asset from Door 2
- [ ] Local test pass — full walkthrough of every view before deploying
- [ ] Acceptance criteria pass — verify every criterion in spec Section 13 "Acceptance Criteria" (16 items) before deploy
- [ ] Deploy to Netlify — push to main; Netlify auto-deploys (no environment variables to set)
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
None yet.
[Rule: one line per decision made during the build that is not in the spec — field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
- Document URLs for "View Document" and "View Policy" are carried as # from v1.0. Replace with real URLs when the builder provides them (Supplier Code of Conduct, Global Environmental Policy).
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at
session start, acts on them, then clears this section.]
