# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 2 — v3.0 build (Supplier Gate + Supabase persistence)
**Last updated:** 13 July 2026
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
The v3.0 build is complete and verified locally. On top of the v2.0 two-door flow,
this session added the mandatory **Supplier Gate**, **Supabase persistence** (Tier 2,
D3+A1), and the **GDPR consent** step.

- **Database (live, `qdqvpctmotquybvtzwzs`):** `suppliers` and `submissions` tables
  created via MCP with **anon insert-only** RLS. Verified by simulating the `anon`
  role: insert into both tables succeeds; select/update/delete are denied. Both
  tables are currently empty. `docs/supabase-setup.md` created as the schema source
  of truth.
- **Frontend:** new `SupplierGate` view (company/contact/email, EcoVadis Yes/No,
  GDPR consent checkbox + exact data statement, inline validation, insert-on-Continue
  with retry on failure) and `EcovadisAck` view. Landing's two-button qualification
  tree replaced by a single "Begin Your Submission" CTA into the Gate. `src/lib/
  supabase.js` is the only network egress. The supplier `id` is generated in the
  browser and carried through Door Selection into whichever door is used, so the
  `submissions` insert links via `supplier_id` with **no read-back** anywhere.
- **Verification:** `npm run build` passes. A 25-check Playwright walkthrough passes
  (0 JS errors): single CTA, Gate validation/consent gating, EcoVadis Yes → new tab
  to ecovadis.com + on-screen acknowledgement + `has_ecovadis=true`, EcoVadis No →
  Door Selection + `has_ecovadis=false`, Door 1 completion → linked `submissions`
  insert (`supplier_id` matches, `door_used=door_1_guided`), no GET to Supabase, no
  horizontal overflow at 375px. Not yet deployed to Netlify.

## Last session
- Inspected the live Supabase project before any change: it is **empty** — no GHG
  dashboard tables exist (contrary to spec v3.0 §4/§16). The only pre-existing
  `public` object is an org guardrail event-trigger function `rls_auto_enable()`,
  left untouched.
- Created `suppliers` + `submissions` + anon insert-only RLS; verified insert-only;
  wrote `docs/supabase-setup.md` documenting the true state.
- Built the Supplier Gate, EcoVadis acknowledgement, and Supabase client; wired the
  Landing single CTA, Gate routing, and `supplier_id` through to the submissions
  insert; added GDPR consent. Made both doors' submit async with retry on insert
  failure.
- Verified end-to-end with a 25-check Playwright run (Supabase inserts intercepted,
  since org egress blocks supabase.co from this sandbox).

## Remaining work
- [ ] **Deploy to Netlify** (push to main → auto-deploy). Before/at first deploy,
      add the two env vars in the Netlify dashboard (Netlify MCP not active):
      `VITE_SUPABASE_URL=https://qdqvpctmotquybvtzwzs.supabase.co` and
      `VITE_SUPABASE_ANON_KEY` (anon/public key from Supabase → Settings → API).
- [ ] **Confirm live inserts from the deployed site** (acceptance criterion 15) —
      a real Gate submit creates a `suppliers` row, a completed door creates a linked
      `submissions` row. This could not be exercised locally because the sandbox
      egress policy blocks supabase.co; the DB-level insert-only behaviour and the
      frontend wiring are both verified, so this is the one check left for deploy.
- [ ] Record the Live URL above once deployed.
- [ ] Confirm CTA copy "Begin Your Submission" with the builder (spec §15 open
      question) — easy to change in `Landing.jsx`.
- [ ] Confirm whether the two extra PDFs (Procurement Strategy, Supplier Engagement
      Programme) should get their own resource links (carried over from v2.0).
- [ ] Optional: run the Supabase QA skill to verify schema + RLS and that the
      pre-existing guardrail function was left untouched.
- [ ] Optional hardening: code-split SheetJS out of the main bundle (~737 KB).

## Build decisions
- Developed on branch `claude/replace-docs-files-17q5sd` (PR #1). The v3.0 spec,
  CLAUDE.md, and PROGRESS.md were replaced first; this build follows on the same
  branch/PR.
- **Insert-only with no read-back:** the anon role cannot SELECT, so the browser
  generates the supplier `id` (`crypto.randomUUID()`) and sends it in the Gate
  insert, then reuses it as `submissions.supplier_id`. No `.select()` is ever
  called. This is the clean way to satisfy "carry the supplier id forward" under an
  insert-only policy.
- RLS enforced at two levels: grants (revoke all, grant insert) **and** an INSERT-only
  policy. `get_advisors` flags the `WITH CHECK (true)` policies as permissive — this
  is expected and correct for a public, no-login form; the protection is the absence
  of a SELECT path, which is verified.
- `submissions.door_used` stored as `door_1_guided` / `door_2_upload`; FK to
  `suppliers.id` with `ON DELETE CASCADE` so a manual GDPR deletion removes the
  linked submission.
- EcoVadis path opens a blank tab synchronously on click (within the user gesture),
  then points it at ecovadis.com only after the insert succeeds — avoids popup
  blocking without opening the tab before the record is saved. The acknowledgement
  view also carries a visible EcoVadis link as a fallback.
- Gate insert failure keeps the supplier on the Gate with an inline error and retry;
  door submit insert failure keeps the answers in place and lets them retry — a
  record is never lost, never routed onward without a save.
- Env vars only via `.env` (gitignored) locally and Netlify env vars in prod;
  `.env.example` committed with placeholders. `.gitignore` extended to `.env*`.

## Known issues
- **Spec vs reality:** product-spec v3.0 (§4, §16, criterion 16/17) assumes this
  Supabase project already shares a schema with the GHG emissions dashboard. It does
  not — the project was empty of application tables. The build documents the true
  state in `docs/supabase-setup.md`; the spec text should be corrected on its next
  revision.
- **Pre-existing object:** `public.rls_auto_enable()` (event trigger `ensure_rls`)
  auto-enables RLS on new `public` tables. Left untouched. The advisor flags it as
  anon-executable SECURITY DEFINER; it is an event-trigger function and a direct RPC
  call is a no-op. Not created or owned by this build.
- **Local live-insert not exercisable here:** the sandbox egress policy blocks
  supabase.co, so the real browser→Supabase insert can only be confirmed on the
  Netlify deploy. Mitigated: DB-level anon insert-only verified via MCP, and the
  full frontend flow verified with intercepted inserts.
- SheetJS keeps the main bundle at ~737 KB (gzip ~230 KB). Acceptable; could
  code-split. The npm `xlsx@0.18.5` audit advisory from v2.0 still stands.
- Google Fonts load from CDN; falls back to Georgia/system fonts if blocked.

## Notes for next session
None.
