# The Corporate Supplier Sustainability Portal 2026

## Identity
A public single-page portal that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment through a mandatory Supplier Gate, then a guided or upload-based questionnaire. Tier 1 supplier contacts use it directly from a link sent by The Corporate's procurement or EHS team.
Tier: 2 — public tool, no login, every gate visit and completed questionnaire now persists to Supabase (D3+A1)
Spec version governed: v3.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone — Supabase project "The Corporate Live Build" is currently used only by this tool; it may be shared with The Corporate's GHG emissions dashboard later, but that hasn't happened yet.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder to re-run the Project Governor on the revised spec before building.
3. Read PROGRESS.md in the project root — it is the current state of this build. If missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat it back to the builder, treat it as this session's priorities, then clear the section.

Save point — after completing any module, feature, fix, or schema change:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. If the database was touched (any table, policy, or config change), update docs/supabase-setup.md in the same save point.
3. Commit and push to main.
4. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session, Remaining work, Build decisions, Known issues, Notes for next session.

## Commands
```
npm install
npm run dev
npm run build
```

## Tech Stack
React · Vite · Tailwind CSS · Netlify · Supabase
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is not active — the builder enters environment variables in the Netlify dashboard; remind them before the first deploy.

## Arms
Export — browser only, no server function. Serves the static workbook The_Corporate_Supplier_Questionnaire_2026.xlsx from public assets as a download in Door 2. No data is populated into the file server-side.

## Environment Variables
VITE_SUPABASE_URL — Supabase: Project Settings → API → Project URL — Netlify env var
VITE_SUPABASE_ANON_KEY — Supabase: Project Settings → API → anon/public key, insert-only via RLS — Netlify env var

Key storage follows function placement: this project has no server functions, so both variables are read only by the frontend at build time via Netlify env vars. No value ever appears in code or in any file committed to GitHub. Confirm both exist in Netlify before the first deploy.

## Supabase
Project: "The Corporate Live Build" (`qdqvpctmotquybvtzwzs`) — already exists, currently empty. Plan: Pro — always on (assumed already active; confirm with the builder if it ever needs upgrading).
docs/supabase-setup.md does not exist yet — this is the first tool to document this project's schema. Confirm via MCP that the project is still empty before creating anything, then write docs/supabase-setup.md documenting the two tables below; it becomes the schema source of truth from that point on, read first every later session and updated at every save point that touches the database. If this project is later shared with another tool (e.g. the GHG dashboard), that tool's own CLAUDE.md documents the resulting stack — not a concern here.
Tables to create: suppliers (id uuid PK, company_name, contact_name, contact_email, has_ecovadis boolean, created_at); submissions (id uuid PK, supplier_id FK → suppliers.id, door_used, answers jsonb, submitted_at).
RLS — build these, never skip: both tables anon insert-only, no select/update/delete for the anon role.

## Hard Rules
- API keys never in any frontend file or GitHub commit. The anon key is public by design (RLS restricts what it can do) and is the only Supabase credential the frontend needs. No auth in this tool (A1) — Netlify Identity: never, and Supabase Auth is not used.
- RLS never disabled on either table — fix the policy or the query instead. The service role key is only ever used transiently via MCP during schema setup, never written into any project file or used by the frontend.
- No uploaded file (Door 2) or in-progress form state may leave the browser except the two Supabase inserts described above. The Confirmation view stays built entirely from browser state — never add a Supabase read-back there.
- GDPR: consent checkbox and the confirmed data statement ("Your data will be stored securely and used only to track and manage supplier responses to The Corporate's Sustainability Assessment. You can request deletion at any time by contacting info@thecorporate.com.") required on the Gate before Continue can be clicked. Personal data: contact name, contact email. Deletion requests go to info@thecorporate.com, handled manually in Supabase — no in-app deletion flow.

## Project Structure
```
/                     ← root: CLAUDE.md, PROGRESS.md only
/src
  /components
  /lib                ← Supabase client
/docs                 ← product-spec.md, supabase-setup.md
/.claude/skills/the-corporate-brand/   ← brand skill (already installed)
/public/assets        ← The_Corporate_Supplier_Questionnaire_2026.xlsx
```

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (already installed from the v2.0 build). Invoke it for the new Supplier Gate view as well as everywhere else.
Hard rules that hold even if the skill is not loaded:
- Surfaces: Linen #EAE4D5, Chalk #F2F2F2, or White. Text: Ink #000000. Borders: Stone #B6B09F, 0.5px. Never Tailwind gray defaults.
- Accent: Acid Lime #C8F135 — maximum two uses per page, only against Ink #000000, never on a light background.
- Fonts: Playfair Display for headlines, DM Sans for body and labels (300 body, 500 labels/emphasis).
- Square corners (border-radius: 0), no shadows, no gradients. Error and validation states stay inside the palette — no red, no colour outside the brand tokens.

## Business Rules
- The Supplier Gate is mandatory and precedes both routes, replacing the old two-button choice with a single CTA. Company name, contact name, contact email, and EcoVadis Yes/No are all required, and the consent checkbox must be checked before Continue is enabled.
- Gate routing: EcoVadis = Yes inserts the suppliers row, opens ecovadis.com in a new tab, and shows an on-screen acknowledgement in the portal tab (no further in-app navigation); EcoVadis = No inserts the row and proceeds to Door Selection. If the insert fails, show an inline error and let the supplier retry — never route onward without a saved record.
- Engagement status is read by joining tables, not a status column: has_ecovadis = true with no submissions row means that visit went to EcoVadis; has_ecovadis = false with no submissions row means the Gate was completed but the questionnaire wasn't finished; has_ecovadis = false with a submissions row means it's complete.
- Every Gate visit creates a fresh suppliers row — no matching or de-duplication by company. Carry suppliers.id through Door Selection and whichever door is used so the submissions insert links via supplier_id; only create that row if the supplier finishes a door, never for the EcoVadis path.
- Door 1 and Door 2 field validation, matching, and rejection logic are unchanged from v2.0 and still derive from The_Corporate_Supplier_Questionnaire_2026.xlsx.

Out of scope — do not build:
- Internal review dashboard for EHS and procurement (deferred; may form a Tier 3 stack with this tool once specced separately)
- Pre-loaded supplier roster or matching visits by company name
- Confirmation screen reading back from Supabase
- Retaining the original uploaded Door 2 file
- Automated email notification or confirmation
- Automated EcoVadis scorecard validation
- In-app data deletion flow

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full view specs, logic, validation and matching rules, arm detail, acceptance criteria
- docs/supabase-setup.md — schema source of truth (created this session, against a currently-empty project)
- public/assets/The_Corporate_Supplier_Questionnaire_2026.xlsx — the single source of truth for Door 1's fields and Door 2's parser
- .claude/skills/the-corporate-brand/SKILL.md — full brand system
PROGRESS.md in the root is read at every session start per the Session Protocol.
