# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 3.0
**Date:** 12 July 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A public single-page portal that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment. Every visitor now identifies themselves first, company name, contact name, contact email, and whether they hold an EcoVadis scorecard, before anything else happens. That answer determines their path automatically: EcoVadis holders are sent to ecovadis.com; everyone else proceeds into the existing two-door questionnaire flow (a guided S1 to S7 form, or a download, complete, and upload flow). Completed questionnaires and every gate visit are now saved to a database so The Corporate can retrieve them later. Nothing uploaded is retained, and the on-screen confirmation still works entirely from the browser session, not from a database read.

**Who uses it:** Tier 1 supplier contacts (sustainability managers, EHS leads, and procurement representatives at supplier organisations) who receive the URL directly from The Corporate's procurement or EHS team.

**Why it exists:** v2.0 proved the in-portal submission mechanics but was session-only: nobody at The Corporate could see who had engaged or what they submitted without the supplier emailing something separately. This version adds persistence so submissions and engagement are retrievable, and adds a mandatory identification step so every visitor is captured in the record, not just the ones who complete a questionnaire.

**Build status:** Iteration. The previous version (v2.0, 10 July 2026) was a session-only (D2, Tier 1) React rebuild with no database. This version adds a Supplier Gate view, a Supabase database, and becomes Tier 2 (D3+A1: database, still no login).

---

## Section 2 — Classification

This section defines the architecture of the tool. Every downstream decision follows from this.

### Data Model

**Decision:** D3

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. The tool displays what the developer put in. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | No |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | Yes |

**Reason:** The Corporate needs to retrieve who has engaged with the portal and what they submitted after the supplier's session ends. Every gate visit and every completed questionnaire must be readable by The Corporate later, so data now lives in Supabase rather than only in the browser.

**D3 is triggered — checked below:**
- [x] Data must be retrievable after the session ends
- [x] Multiple sessions contribute to the same dataset (every gate visit and submission accumulates in the same tables)
- [ ] An audit trail or history is needed
- [x] Data submitted by one person must be visible to another (The Corporate reviews what suppliers submit)
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged-in users see the same thing and have the same permissions. | No |
| A3 — Authorization | Users must log in and have different roles. Different roles see different data or have different permissions. | No |

**Reason:** Unchanged from v2.0. The portal is still distributed to Tier 1 suppliers as a direct link. Anyone with the URL can use it immediately. No account or login is required for the supplier side.

> **Promotion rule:** Auth requires a database. If the access model is A2 or A3, the data model is D3 — even when all displayed content is fixed. Not applicable here: this tool is A1, and D3 is triggered by the need to persist and review data, not by auth.

---

### Tier

**Tier:** 2

| Tier | D+A combination | Stack | Deployment |
|------|----------------|-------|------------|
| 1 | D1+A1 or D2+A1 | Netlify only | Netlify |
| 2 | D3+A1 | Netlify + Supabase (no auth) | Netlify |
| 3 | D3+A2 or D3+A3 | Netlify + Supabase (auth + RLS) | Netlify |

D3 + A1 resolves to Tier 2. Database added, still no login.

---

### Standalone or Stack

**This tool is:** Standalone. It does not currently share a database schema role with any other tool's user-facing logic, though it now shares a Supabase *project* with The Corporate's GHG emissions dashboard (see Section 4).

> When the internal review dashboard for EHS and procurement is eventually built (deferred, see Section 12), it will form a stack with this tool: this tool becomes Tool A (public submission side, the schema-creating tool, already built), and the review dashboard becomes Tool B (internal side, Tier 3, its own spec, its own repo, reading `docs/supabase-setup.md` produced by this build).

---

## Section 3 — Arms

Arms are capabilities added to the tool. They do not change the tier. Mark each arm active or not, and complete the detail only for active arms.

> **Document search and AI knowledge bases are outside this framework version.** Not applicable to this tool.

---

### AI API Arm

**Active:** No

The Door 2 upload is read and mapped by plain client-side file parsing, not AI. No classification, explanation, summarisation, or generation happens in this tool.

---

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | XLSX |
| What is exported | The pre-formatted Excel workbook, The_Corporate_Supplier_Questionnaire_2026.xlsx, served as a static asset. Unchanged from v2.0: the supplier downloads it from Door 2, completes it offline, and uploads it back. The file is served as a static asset with no data populated server-side. |
| PDF design intent | N/A — format is XLSX only |

---

### Email Arm

**Active:** No

No email is sent anywhere. The Confirmation view and, on the EcoVadis path, the Gate acknowledgement (see Section 8) remain on-screen only.

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | React + Vite + Tailwind. Unchanged from v2.0. |
| Deployment target | Netlify |
| Netlify MCP | Not active. Deployment is manual in the sense that no Claude Desktop connector drives it, but the repo is already connected to Netlify: pushing to `main` triggers an automatic deploy, as it does today. No dashboard clicking required per deploy. |

**File parsing:** Unchanged. Door 2 reads uploaded .xlsx and .csv files entirely client-side using SheetJS. No server, no backend function, no network call carrying questionnaire data through anything other than the two new Supabase inserts described in Section 5.

**GitHub — pre-build requirement:**
The existing project repo is used. The updated product-spec.md (this v3.0), CLAUDE.md, and PROGRESS.md must be uploaded to the repo root before Claude Code opens. Claude Code assumes the repo exists, commits changes regularly, and pushes to main.

---

### CONDITIONAL: Supabase project — Tier 2

**Supabase project status:** Existing — a project already exists for this context.

**Supabase plan:** Pro — always on. Suppliers use this tool intermittently rather than daily; a paused project would look broken to a supplier mid-assessment, and pausing would also affect the GHG emissions dashboard sharing this project.

| Detail | Answer |
|--------|--------|
| Project name | The Corporate Live Build |
| Project ID | `qdqvpctmotquybvtzwzs` |
| supabase-setup.md location | Does not exist yet. This is the **first** tool in this project to formally document its schema. |

> **This build session creates `docs/supabase-setup.md` for the first time.** Because the GHG emissions dashboard already uses this project, Claude Code must connect via the Supabase MCP and inspect the existing schema (tables, RLS policies, auth configuration already in place for the GHG dashboard) **before** creating `suppliers` or `submissions`, to avoid any naming collision or unintended interaction with existing tables. Once created, `docs/supabase-setup.md` must document the full project state: the pre-existing GHG dashboard tables (as found, not re-derived) plus the two new tables this build adds. This file becomes the schema source of truth for every future build session against this project, including the eventual internal review dashboard (Section 2).

---

### CONDITIONAL: Only complete if this tool is part of a stack

N/A — standalone for now. See Section 2 for this tool's future role as Tool A if the internal review dashboard is built later.

---

## Section 5 — Data Architecture

### CONDITIONAL: Data Model is D3

This section is the input Claude Code uses to build the database schema via MCP.

**What data is collected or stored in this tool:**

| Field name | Plain language label | Data type | Who provides it | Required? |
|-----------|---------------------|-----------|----------------|-----------|
| company_name | Company name | Text | Supplier, at the Gate | Yes |
| contact_name | Contact person's name | Text | Supplier, at the Gate | Yes |
| contact_email | Contact person's email | Text | Supplier, at the Gate | Yes |
| has_ecovadis | Do you have an EcoVadis scorecard? | Boolean (Yes/No) | Supplier, at the Gate | Yes |
| gate_created_at | Timestamp of gate submission | Timestamp | Automatic | Yes |
| door_used | Which door was used to submit | Text ('door_1_guided' / 'door_2_upload') | Automatic, set on submit | Yes (submissions only) |
| answers | Questionnaire responses, S1 to S7 | JSON | Supplier, via Door 1 or Door 2 | Yes (submissions only) |
| submitted_at | Timestamp of questionnaire submission | Timestamp | Automatic | Yes (submissions only) |

**Tables needed:**

| Table name | What it stores | Key fields |
|-----------|---------------|-----------|
| suppliers | One row per Supplier Gate visit. Created the moment someone completes the Gate, regardless of which path they take next. A fresh row is created on every visit — no matching or de-duplication against prior visits by the same company. | id (uuid, PK), company_name, contact_name, contact_email, has_ecovadis, created_at |
| submissions | One row per completed questionnaire. Only created if the supplier finishes Door 1 or Door 2 — never created for the EcoVadis path. | id (uuid, PK), supplier_id (FK → suppliers.id), door_used, answers (jsonb), submitted_at |

**Reading engagement status without a status column:** `has_ecovadis = true` on a suppliers row means that visit was routed to EcoVadis and nothing further is expected. `has_ecovadis = false` with no matching row in `submissions` means the questionnaire was started (the Gate was completed) but not finished. `has_ecovadis = false` with a matching `submissions` row means the questionnaire is complete. This is read directly with a join; no separate status field needs to be kept in sync.

**File storage:** No. The uploaded .xlsx or .csv in Door 2 is parsed entirely in the browser as it is today; only the parsed `answers` are written to `submissions`. The original file is never uploaded to Supabase Storage or retained anywhere.

**Derived or calculated data:** No. Nothing is scored or calculated from the stored data in this build.

**Row-level security (required, even though Access Model is A1):** Since there is still no login, the Supabase anon key used by the browser must be restricted to **insert-only** on both `suppliers` and `submissions`. No select, update, or delete permission for the anon role on either table. This prevents any supplier (or anyone with the anon key, which is necessarily public in the frontend bundle) from reading another supplier's data back through the app. Claude Code builds these policies via MCP during the build session; the Supabase QA skill can verify them after the build.

---

## Section 6 — Access and Permissions

### CONDITIONAL: Only complete if Access Model is A2 or A3

N/A — Access Model is A1. No authentication, no roles, no per-role RLS. See Section 5 for the anon insert-only policy that applies instead.

---

## Section 7 — GDPR

### MANDATORY DECISION — complete for every D3 tool

**GDPR outcome:** Applies — personal data is collected through the tool's forms.

> **Scope rule:** This tool now collects contact name and email through the Supplier Gate, in addition to company name. That is personal data collected through a public form, so the full consent framework applies.

**Personal data collected:**
- Contact person's name
- Contact person's email
- Company name (organisational, included for completeness though not personal data on its own)

**Consent checkpoint on the form:** Yes — a checkbox and data statement appear on the Supplier Gate before Continue can be clicked.

**Data statement text shown to users at the point of collection:**
> "Your data will be stored securely and used only to track and manage supplier responses to The Corporate's Sustainability Assessment. You can request deletion at any time by contacting info@thecorporate.com."

**Deletion mechanism:**
A supplier or contact requests deletion by emailing info@thecorporate.com. The Corporate's team locates the record by company name and/or contact email in Supabase and deletes the corresponding `suppliers` row (and any linked `submissions` row via cascade) directly in the Supabase dashboard. No in-app deletion flow is built in this version.

---

## Section 8 — Screen and UI Structure

The tool remains one deployed React site with several views. Navigation between them happens in-app.

### Landing Page

- **Purpose:** Introduce the assessment and lead every visitor into the Supplier Gate.
- **What is visible:** All v2.0 content is preserved: navigation bar, hero, "Why We Are Asking," "What Happens Next," "Key Resources," and the footer. **Change from v2.0:** the "Two Routes. One Destination." section's two separate action buttons (Submit EcoVadis Scorecard / Complete the Questionnaire) are replaced with a single call-to-action button leading into the Supplier Gate. The informational copy explaining that EcoVadis holders and questionnaire respondents follow different paths can remain as context-setting text above the single button.
- **User actions:** Click the single CTA to begin (opens the Supplier Gate); click "View Document" and "View Policy" (unchanged); click "Contact EHS" (unchanged, mailto). Scroll the single landing view.
- **What happens next:** The CTA navigates in-app to the Supplier Gate.

### Supplier Gate (new)

- **Purpose:** Identify every visitor before they take any path, and capture whether they hold an EcoVadis scorecard, so The Corporate has a record of engagement regardless of route.
- **What is visible:** Company name field (required), contact name field (required), contact email field (required), a "Do you have an EcoVadis scorecard?" Yes/No selector (required), the GDPR consent checkbox with the data statement from Section 7, and a Continue button.
- **User actions:** Fill in the three identifying fields, select Yes or No, check the consent box. Continue is disabled until every required field and the checkbox are complete. Inline validation messages match the style used elsewhere in the tool.
- **What happens next:** On Continue, a `suppliers` row is inserted via Supabase (anon, insert-only).
  - If **Yes**: ecovadis.com opens in a new tab, exactly as the current EcoVadis button behaves. The portal tab shows a brief on-screen acknowledgement ("Your information has been recorded. Complete your scorecard on EcoVadis.") rather than navigating further.
  - If **No**: the supplier proceeds in-app to Door Selection, unchanged from v2.0.

### Door Selection, Door 1 — Guided Questionnaire, Door 2 — Download and Upload, Door 2 — Review / Rejection

Unchanged from v2.0 in content, fields, validation, and matching logic. See the v2.0 spec for full detail; nothing about these views' visible content or logic changes in this version.

### Confirmation

- **Purpose:** Confirm to the supplier what they submitted.
- **What is visible:** Unchanged from v2.0 — a confirmation heading, a summary of the submitted answers organised by section, a note that no email is sent, and the brand footer.
- **User actions:** None required. An optional link returns to the landing page.
- **What happens next:** In addition to the existing on-screen confirmation, a `submissions` row is now inserted via Supabase (anon, insert-only), linked to the `suppliers` row created at the Gate. **The Confirmation view itself is still built entirely from what remains in browser state — it does not read this row back from Supabase.** Closing the tab still clears all in-progress browser state; only the two inserted rows persist.

---

## Section 9 — Logic and Calculations

This tool applies decision rules (field validation, EcoVadis routing, file matching). It performs no scoring or calculation.

**What is calculated or scored:** Nothing. Three sets of decision rules apply: Gate validation and routing, Door 1 field validation, and Door 2 file matching.

**Inputs:** The Gate takes company name, contact name, contact email, and the EcoVadis Yes/No selection. Door 1 takes the supplier's typed and selected answers. Door 2 takes the uploaded .xlsx or .csv file.

**Formula or rules:**

- **Gate validation:** Company name, contact name, contact email, and the EcoVadis selection are all required; the consent checkbox must be checked. Continue is blocked until all are satisfied.
- **Gate routing:** EcoVadis = Yes routes externally to ecovadis.com and ends the in-portal flow for that visit (after the `suppliers` insert). EcoVadis = No routes in-app to Door Selection.
- **Field structure, single source of truth:** Unchanged from v2.0 — The_Corporate_Supplier_Questionnaire_2026.xlsx defines Door 1's fields and Door 2's parser.
- **Door 1 validation and Door 2 matching:** Unchanged from v2.0.
- **Linking a submission to its supplier:** Whichever door the supplier used, the `submissions` row created on final submit is linked via `supplier_id` to the `suppliers` row created when that same visit completed the Gate. The frontend carries the `suppliers.id` returned from the Gate insert through Door Selection and into whichever door is used, so the link is correct even though no login ties the two together.

**Output:** A validated set of answers ready for the on-screen confirmation, and now also two persisted rows (`suppliers` always, `submissions` if a questionnaire is completed).

**Edge cases:**
- Gate: required field left blank, EcoVadis not selected, or consent not checked — block Continue, inline message.
- Gate: the Supabase insert fails (e.g. network issue) — the supplier should see an inline error and be able to retry Continue; they should not be silently routed onward without a saved record.
- Door 1 and Door 2 edge cases: unchanged from v2.0 (invalid values, wrong file type, structural mismatch, blank cells, closing the tab mid-flow before the final submit).
- Supplier closes the tab after the Gate but before finishing a door: the `suppliers` row already exists (has_ecovadis = false, no linked submission) — this is the expected "started but not finished" state, not an error.

---

## Section 10 — Brand and Visual Direction

**Brand reference:** the-corporate-brand skill file. Unchanged — already installed at `.claude/skills/the-corporate-brand/` from the v2.0 build.

**Visual feel:** Corporate minimalism, unchanged. The new Supplier Gate view uses the same brand tokens, form field styling, and validation-message conventions as the existing Door 1 wizard.

**Key brand rules Claude Code must enforce, including on the new Gate view:**
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels and emphasis).
- Colours: Ink (#000000), Stone (#B6B09F), Linen (#EAE4D5), Chalk (#F2F2F2), White (#FFFFFF), Acid Lime (#C8F135).
- Acid Lime: maximum 2 uses per page, always against #000000, never directly on light backgrounds.
- Square corners (border-radius: 0), no shadows, no gradients.
- Error, empty, and validation states stay inside the palette — no red, no colour outside the brand tokens, matching the existing Door 1 wizard's inline validation style.

**Reference or inspiration:** The existing v2.0 build (same site).

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database only (no Auth, no Storage used) — stores `suppliers` and `submissions` | Anon key (public, browser-safe, insert-only via RLS) | Netlify environment variable |

> **Security rule:** The anon key is public by design (RLS restricts what it can do), but it must still only ever appear as a Netlify environment variable read at build/runtime — never hardcoded into any committed file. No service role key is needed by the frontend; if Claude Code needs the service role key to set up RLS via MCP, that key is never written into any project file.

**Credentials readiness:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| Supabase anon key | Available — existing project | Supabase dashboard → The Corporate Live Build → Project Settings → API |
| Supabase project ID | Available | `qdqvpctmotquybvtzwzs` (already in this spec, Section 4) |

Since Netlify MCP is not active, the anon key must be copied manually from the Supabase dashboard into Netlify's environment variables after Claude Code confirms the schema is in place.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Internal review dashboard for EHS and procurement | Needs its own access model (login, likely roles) and its own spec. Forms a Tier 3 stack with this tool once built. |
| Pre-loaded supplier roster / matching visits by company name | Not needed yet — every visit now creates its own record, giving full engagement coverage without a roster. Can be added later without changing this schema. |
| Confirmation screen reading back from Supabase | Kept session-only by choice; revisit if a future need arises to show suppliers their own historical submissions. |
| Keeping the original uploaded file | This version still parses in-session and retains nothing beyond the parsed answers. |
| Automated email notification or confirmation | Explicitly not built. On-screen confirmation only, no email anywhere. |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access. |
| In-app data deletion flow | Deletion requests are handled manually by The Corporate's team directly in Supabase (Section 7). |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Landing page renders with the single consolidated CTA | Hero, stats, informational sections all render as v2.0; the old two-button "Two Routes" action area is replaced by one CTA leading to the Supplier Gate | [ ] |
| 2 | Supplier Gate blocks Continue on incomplete input | Continue is disabled/blocked while company name, contact name, contact email, EcoVadis selection, or the consent checkbox is missing; inline messages shown | [ ] |
| 3 | Gate submission creates a `suppliers` row | A new row appears in Supabase with correct company_name, contact_name, contact_email, has_ecovadis, and created_at | [ ] |
| 4 | EcoVadis = Yes routes correctly | ecovadis.com opens in a new tab; the portal tab shows the on-screen acknowledgement; `has_ecovadis = true` is recorded | [ ] |
| 5 | EcoVadis = No routes correctly | Supplier proceeds in-app to Door Selection; `has_ecovadis = false` is recorded | [ ] |
| 6 | Door 1 renders and validates as before | Fields, types, dropdowns, units, and required markers match the workbook across all seven sections, identical to v2.0 | [ ] |
| 7 | Door 2 download, upload, and parsing work as before | Download, accepted formats, structural matching, and rejection messaging all match v2.0 behaviour | [ ] |
| 8 | Completing either door creates a linked `submissions` row | A new row appears with the correct `supplier_id` (matching the Gate visit), `door_used`, `answers`, and `submitted_at` | [ ] |
| 9 | Confirmation screen remains session-only | The Confirmation view renders entirely from browser state after submit; no network request fetches the just-saved row back from Supabase | [ ] |
| 10 | GDPR consent blocks submission | The Gate cannot be submitted without the consent checkbox checked; the exact data statement text from Section 7 is shown | [ ] |
| 11 | Anon key is insert-only | Browser dev tools / a direct query confirm the anon role can insert into `suppliers` and `submissions` but cannot select, update, or delete either table | [ ] |
| 12 | No uploaded file is stored | Only parsed answers reach `submissions.answers`; the original Door 2 file is never sent to Supabase Storage or any server | [ ] |
| 13 | Brand identity applied to the Supplier Gate | Fonts, palette, square corners, Acid Lime rule, and validation style match the rest of the tool | [ ] |
| 14 | Fully responsive on mobile | Supplier Gate, Door Selection, wizard, upload, review, and confirmation are all usable below 768px with no horizontal overflow | [ ] |
| 15 | Tool deploys to Netlify | Live URL loads on desktop and mobile after pushing to main; no 404s; Supabase inserts succeed from the deployed site (not just locally) | [ ] |
| 16 | Existing Supabase schema is respected | Claude Code inspects the existing GHG emissions dashboard tables in The Corporate Live Build before creating `suppliers` or `submissions`; no naming collision or unintended change to existing tables | [ ] |
| 17 | `docs/supabase-setup.md` is created | The file exists after the build, documents the pre-existing GHG dashboard schema as found plus the two new tables, and will be read by any future build session against this project | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 2

---

### Pre-build steps — complete these before opening Claude Code

- [ ] Tool Architect skill — interview complete, this spec (v3.0) is written and confirmed
- [ ] Project Governor skill — updated CLAUDE.md and PROGRESS.md produced from this spec
- [ ] Existing project GitHub repo used (same repo as v2.0)
- [ ] product-spec.md (this v3.0) uploaded to the repo root, replacing v2.0
- [ ] Updated CLAUDE.md uploaded to the repo root
- [ ] Updated PROGRESS.md uploaded to the repo root
- [ ] the-corporate-brand skill file already present from the v2.0 build — no action needed
- [ ] Netlify remains connected to the GitHub repo (Netlify MCP not active, confirmed)
- [ ] Supabase anon key for The Corporate Live Build available to enter as a Netlify environment variable after the schema is built

> Claude Code organizes these files into the correct folder structure automatically at the start of the session, as it did for v2.0.

---

### Tier 2 — build session

- [ ] Open Claude Code in the project folder
- [ ] Claude Code reads product-spec.md (v3.0), CLAUDE.md, and PROGRESS.md
- [ ] **Supabase — existing project, first schema documentation:** Claude Code connects to The Corporate Live Build (`qdqvpctmotquybvtzwzs`) via Supabase MCP and inspects the current schema (the GHG emissions dashboard's existing tables) before making any changes
- [ ] Claude Code builds the `suppliers` and `submissions` tables and the anon insert-only RLS policies via Supabase MCP
- [ ] Claude Code creates `docs/supabase-setup.md`, documenting the full project state: pre-existing tables as found, plus `suppliers` and `submissions`
- [ ] Claude Code builds the new Supplier Gate view and wires it into the Landing page's single CTA and into Door Selection
- [ ] Claude Code wires the `suppliers.id` from the Gate insert through to whichever door is used, so the `submissions` insert links correctly
- [ ] Claude Code adds the GDPR consent checkbox and data statement to the Gate
- [ ] Test locally before deploying, including verifying inserts against the live Supabase project
- [ ] Push to main → Netlify deploys automatically (Netlify MCP not active)
- [ ] Add the Supabase anon key as a Netlify environment variable manually in the Netlify dashboard
- [ ] Optional post-build: run the Supabase QA skill to verify the schema and RLS policies, including that the pre-existing GHG dashboard tables were left untouched

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Deployed URL for this version | Builder | No — confirmed after deployment |
| Exact CTA button copy replacing the two Landing page buttons (e.g. "Begin Your Submission") | Builder | No — Claude Code can propose copy consistent with existing v2.0 tone, builder can revise after build |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Retroactive spec of the existing supplier onboarding landing page. Static single-page HTML routing suppliers to EcoVadis or to an Excel download returned by email. |
| v2.0 | 10 July 2026 | Added in-browser questionnaire submission behind the questionnaire route (Door 1 guided form, Door 2 upload/parse/review). Rebuilt in React + Vite + Tailwind. Remained session-only (D2) and Tier 1. |
| v3.0 | 12 July 2026 | Added a mandatory Supplier Gate (company name, contact name, contact email, EcoVadis yes/no) that now precedes both routes and replaces the Landing page's two-button choice. Added persistence via Supabase: `suppliers` and `submissions` tables, anon insert-only RLS, no read-back anywhere in the app. Tool becomes Tier 2 (D3+A1). GDPR consent flow added (checkbox, data statement, manual deletion via info@thecorporate.com). Reuses the existing "The Corporate Live Build" Supabase project (shared with the GHG emissions dashboard); this is the first build to produce `docs/supabase-setup.md` for that project. Netlify deployment unchanged (push to main, no MCP). |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
