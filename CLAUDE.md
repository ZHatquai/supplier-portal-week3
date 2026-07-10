# The Corporate Supplier Sustainability Portal 2026

## Identity
A public single-page portal that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment and lets them complete the questionnaire in the browser through two doors: a guided S1 to S7 form, or a download, complete, and upload flow. Suppliers receive the URL directly from The Corporate's procurement or EHS team. No login.
Tier: 1 — public tool, all data lives in browser session only, no login, no database (D2+A1).
Spec version governed: v2.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line above, STOP. Tell the builder the spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building. Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point — after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one — an ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md into it.
2. Install the brand skill: create .claude/skills/the-corporate-brand/ and place the provided brand file there as SKILL.md (add minimal name/description frontmatter if it has none).
3. Announce what moved, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3 to 5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npm install
npm run dev
npm run build
```

## Tech Stack
React · Vite · Tailwind CSS · Netlify. No backend, no database, no email.
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is not active — the builder has connected the repo to Netlify. Deploy by pushing to main. There are no environment variables to set.

## Arms
Export — browser only, no server function. Serves the static workbook The_Corporate_Supplier_Questionnaire_2026.xlsx from public assets as a download in Door 2. This is a static file download, not a generated export: no data is populated into the file.

## Hard Rules
- No backend, no server functions, no API keys. All form state, file parsing, and validation run client-side in the browser. Never add a Netlify Function, a network call, or any server round-trip.
- Nothing is stored and nothing is transmitted. No questionnaire answer and no uploaded file may leave the browser. Browser dev tools must show no network request carrying submission data or the uploaded file (acceptance criterion 14).
- The_Corporate_Supplier_Questionnaire_2026.xlsx is the single source of truth for both Door 1's fields and Door 2's parser. Derive every field label, section (S1 to S7), input type, dropdown list, unit, and required flag from the workbook. Never hand-author either the form or the parser independently of it.
- The uploaded file is parsed in session and never retained.
- No email anywhere. Either door ends on an on-screen confirmation only.

## Project Structure
```
/                     ← root: CLAUDE.md, PROGRESS.md only
/src
  /components
/docs                 ← product-spec.md
/.claude/skills/the-corporate-brand/   ← brand skill (installed session 1)
/public/assets        ← The_Corporate_Supplier_Questionnaire_2026.xlsx
```

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (installed in First Session Setup). Invoke it for any UI or visual work.
Hard rules that hold even if the skill is not loaded:
- Surfaces: Linen #EAE4D5, Chalk #F2F2F2, or White. Text: Ink #000000. Borders: Stone #B6B09F, 0.5px. Never Tailwind gray defaults.
- Accent: Acid Lime #C8F135 — maximum two uses per page, only against Ink #000000, never on a light background. Never a blue default.
- Fonts: Playfair Display for headlines, DM Sans for body and labels (300 body, 500 labels and emphasis).
- Square corners (border-radius: 0), no shadows, no gradients. Error and empty states stay inside the palette — no red, no colour outside the brand tokens.

## Business Rules
- EcoVadis route is unchanged and stays first. "Submit EcoVadis Scorecard" opens ecovadis.com in a new tab; the portal tab stays open.
- Route 2 card CTA reads "Complete the Questionnaire" and opens Door Selection. The v1.0 email-return instruction copy is removed from that card.
- Door 1: a section cannot advance, and the questionnaire cannot submit, while a required field is missing or a value is invalid. Dropdowns accept only listed values; number fields accept only numbers, with units where the workbook specifies them. Validation messages appear inline.
- Door 2: strict on structure, lenient on completeness. Accept only .xlsx or .csv. A file whose sections S1 to S7, sheet layout, or headers do not match the 2026 template is rejected with a message naming what did not match — no silent guessing, no partial mapping of a non-matching file.
- Door 2: blank cells in a structurally matching file are accepted and shown as empty in Review. Only a structural mismatch blocks a file.
- Confirmation states plainly that no email is sent and nothing is stored; closing the tab clears the session.

Out of scope — do not build:
- Persistence or any Supabase database
- GDPR consent flow on the form
- Internal review dashboard for EHS and procurement
- Submission tracker (percent of Tier 1 suppliers responded)
- Supplier login or saved progress
- Retaining the uploaded file after parsing
- Any automated email notification or confirmation
- Automated EcoVadis scorecard validation

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full view specs, logic, validation and matching rules, arm detail, acceptance criteria
- public/assets/The_Corporate_Supplier_Questionnaire_2026.xlsx — the single source of truth for Door 1's fields and Door 2's parser; inspect it before building either
- .claude/skills/the-corporate-brand/SKILL.md — full brand system
PROGRESS.md in the root is read at every session start per the Session Protocol.
