# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 1 — first build complete
**Last updated:** 10 July 2026
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
The React + Vite + Tailwind rebuild is built and verified locally. All views work
end to end: Landing (all v1.0 content ported, Route 2 amended), Door Selection,
Door 1 guided S1–S7 wizard with inline validation, Door 2 download/upload with
client-side parsing, a Review screen, structural rejection, and an on-screen
Confirmation. `npm run build` passes. A 17-check parser harness and a 26-check
Playwright walkthrough both pass (0 JS errors, 0 non-GET requests, no horizontal
overflow at 375px). The questionnaire workbook, both policy PDFs, and two extra
reference PDFs are served from `public/assets`. Not yet deployed to Netlify.

Files are organised per CLAUDE.md: `docs/product-spec.md`,
`.claude/skills/the-corporate-brand/SKILL.md`, `public/assets/*`, and the React
app under `src/`. `src/data/questionnaire.js` is the single source of truth
(derived from the workbook) that both doors consume.

## Last session
- Ran First Session Setup: moved the spec to `docs/`, the workbook + PDFs to
  `public/assets/`, and installed the brand skill (reconstructed — see below).
- Inspected the workbook and derived the full S1–S7 field model into
  `src/data/questionnaire.js`; built the Door 2 parser against it.
- Ported the v1.0 landing verbatim; amended the Route 2 card (CTA "Complete the
  Questionnaire" → Door Selection; email-return copy removed; EcoVadis → ecovadis.com).
- Built Door Selection, the Door 1 wizard, Door 2 upload/parse/review/rejection,
  and Confirmation. Wired the two resource links to the bundled PDFs.
- Verified with a parser test harness and a full Playwright end-to-end pass.

## Remaining work
- [ ] Deploy to Netlify (push to the connected repo → auto-deploy) and confirm
      acceptance criterion 16: live URL loads on desktop and mobile, no 404s, the
      Excel downloads from the deployed site. Record the Live URL above.
- [ ] Confirm with the builder whether the two extra PDFs (Procurement Strategy,
      Supplier Engagement Programme) should get their own resource links.
- [ ] Optional hardening: code-split SheetJS into Door 2; revisit the xlsx advisory.

## Build decisions
- Developed and pushed to branch `claude/folder-content-build-rzzg8r` per the task's
  branch requirement (not `main`), so a PR can be reviewed before merge.
- Stack: React + Vite + Tailwind v3. Brand tokens and the v1.0 landing CSS are
  ported into `src/index.css` for pixel fidelity; Tailwind's palette is locked to
  the brand tokens only (no gray/blue defaults). New views use the same tokens.
- Navigation is an in-app view state machine in `App.jsx` (no router). All state
  lives in browser memory and clears when the tab closes.
- `src/data/questionnaire.js` is the single source of truth; Door 1 and the Door 2
  parser both read it. Nothing is hand-authored independently of the workbook.
- S2 Scope 2 (workbook cell E12) carries both TYPE=Quantitative and a stray
  data-validation list; TYPE is authoritative (matches Scope 1/3) → number+unit input.
- Door 1 required logic: S1 Q1/Q2/Q3 always required; S1 Q4 (scorecard link)
  required only when EcoVadis = "Yes — Scorecard Attached"; S2–S7 required unless
  the EcoVadis bypass is chosen, in which case they are optional.
- Door 2 matching is strict on structure: exact header row, all 7 sections present,
  and the 30 question labels in order. Section-title rows are excluded by their
  empty TYPE column. CSV uploads are decoded as UTF-8 (type:'string') so the en
  dash in "S2–S7" survives. Blank cells are accepted and shown empty in Review.
- EcoVadis CTA opens https://ecovadis.com in a new tab (acceptance criterion 2),
  reconciling the v1.0 mailto button.
- Resource links now point at the bundled PDFs (resolves the v1.0 "#" issue):
  View Document → Supplier Code of Conduct, View Policy → Global Environmental Policy.

## Known issues
- The `the-corporate-brand` SKILL.md was reconstructed from CLAUDE.md and spec §10
  because no standalone brand file was supplied to the repo. Swap in the official
  file if it is later provided.
- SheetJS on npm (`xlsx@0.18.5`) carries npm-audit advisories; the fixed builds are
  only on SheetJS's own CDN, not npm. Acceptable for this client-side parser of a
  controlled template; revisit if hardening is required.
- Production bundle is ~515 KB (mostly SheetJS). Fine for now; could code-split.
- Google Fonts load from the CDN; if blocked, the app falls back to Georgia/system
  fonts. (This is why the sandbox headless browser showed a font request reset.)

## Notes for next session
None.
