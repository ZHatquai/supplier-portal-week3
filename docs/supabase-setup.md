# Supabase Setup — The Corporate Live Build

**Schema source of truth for the Supplier Sustainability Portal 2026.**
Read this first at the start of any session that touches the database, and update
it in the same save point as any table, policy, or config change.

- **Project name:** The Corporate Live Build
- **Project ID / ref:** `qdqvpctmotquybvtzwzs`
- **Region:** eu-west-1
- **Postgres:** 17
- **Plan:** Pro — always on
- **Auth:** Not used. This tool is public (A1); the browser talks to Supabase with
  the anon key only. No Supabase Auth, no Netlify Identity.
- **Storage:** Not used. The Door 2 upload is parsed entirely in the browser; no
  file is ever written to Supabase Storage.

---

## State found before this build (v3.0, session 2)

Product-spec v3.0 (Sections 4 and 16) assumed this project already shared a schema
with The Corporate's GHG emissions dashboard, and instructed this build to inspect
those pre-existing tables before adding its own. **That assumption did not hold.**
Inspection via the Supabase MCP found:

- **No application tables in any user schema.** `public` was empty; the only base
  tables anywhere were Supabase's own system schemas (`auth`, `storage`). No GHG
  emissions dashboard tables exist in this project.
- **One pre-existing object in `public`:** an event-trigger function,
  `public.rls_auto_enable()`, wired to the event trigger `ensure_rls` on
  `ddl_command_end`. It automatically runs `ALTER TABLE ... ENABLE ROW LEVEL
  SECURITY` on any new table created in the `public` schema — an org-level
  guardrail so no table can be created without RLS.

This matches the note carried in PROGRESS.md and CLAUDE.md from the v2.0 build: the
project is, in reality, still empty and not yet shared with any other tool. The
spec text should be corrected on its next revision. **Nothing pre-existing was
modified or removed** (acceptance criterion 16): `rls_auto_enable()` and its event
trigger were left exactly as found. The two tables below were created explicitly
with RLS enabled, so they do not depend on the guardrail — but the guardrail would
have enabled RLS on them regardless.

If this project is later genuinely shared with the GHG emissions dashboard (or any
other tool), that tool's own tables should be added to the inventory below as found,
not re-derived.

---

## Tables created by this build

### `public.suppliers`

One row per Supplier Gate visit — created the moment someone completes the Gate,
regardless of which path they then take. A fresh row is created on every visit; no
matching or de-duplication against prior visits by the same company.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key. Default `gen_random_uuid()`, but the browser supplies its own `crypto.randomUUID()` on insert (see "How the frontend inserts" below). |
| `company_name` | `text` | Not null. |
| `contact_name` | `text` | Not null. Personal data (GDPR). |
| `contact_email` | `text` | Not null. Personal data (GDPR). |
| `has_ecovadis` | `boolean` | Not null. `true` = routed to EcoVadis, `false` = proceeded to the doors. |
| `created_at` | `timestamptz` | Not null, default `now()`. |

### `public.submissions`

One row per completed questionnaire. Created only if the supplier finishes Door 1 or
Door 2 — never for the EcoVadis path.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()`. |
| `supplier_id` | `uuid` | Not null. FK → `suppliers.id`, `ON DELETE CASCADE`. |
| `door_used` | `text` | Not null. `CHECK (door_used in ('door_1_guided','door_2_upload'))`. |
| `answers` | `jsonb` | Not null. The parsed/entered S1–S7 answers. |
| `submitted_at` | `timestamptz` | Not null, default `now()`. |

Index: `submissions_supplier_id_idx` on `(supplier_id)`.

**Reading engagement status (no status column):** join `suppliers` to `submissions`.
`has_ecovadis = true` → that visit went to EcoVadis, nothing further expected.
`has_ecovadis = false` with no `submissions` row → Gate completed, questionnaire not
finished. `has_ecovadis = false` with a `submissions` row → complete.

---

## Row-Level Security — anon insert-only

Both tables are **insert-only for the `anon` (and `authenticated`) roles**, enforced
at two levels:

1. **Grants:** all privileges revoked from `anon`/`authenticated`, then only
   `INSERT` granted back. No `SELECT`/`UPDATE`/`DELETE` grant exists.
2. **RLS:** enabled on both tables, with a single `INSERT` policy each
   (`WITH CHECK (true)`). With no SELECT/UPDATE/DELETE policy, those operations are
   default-denied even if a grant were ever re-added.

| Table | Policy | Command | Roles | Check |
|-------|--------|---------|-------|-------|
| `suppliers` | `anon insert suppliers` | INSERT | anon, authenticated | `true` |
| `submissions` | `anon insert submissions` | INSERT | anon, authenticated | `true` |

**Verified** (session 2) by simulating the `anon` role in a rolled-back transaction:
insert into both tables succeeded; `select`, `update`, and `delete` each returned
`permission denied for table …`. No test data persisted.

> **Advisor note:** `get_advisors` reports `rls_policy_always_true` WARNs on both
> INSERT policies. This is expected and accepted for this tool: there is no login
> and no per-row ownership, so a public supplier form must accept any insert. The
> protection that matters — no read-back through the anon key — comes from the
> absence of a SELECT policy/grant, which is verified above. Do **not** "fix" these
> by adding restrictive checks that would block legitimate Gate/questionnaire
> inserts.

Two further advisor WARNs concern the pre-existing `rls_auto_enable()` SECURITY
DEFINER function being executable by anon/authenticated. It is an event-trigger
function; invoking it directly over RPC does nothing (it only has effect inside a
DDL event-trigger context). It was not created by this build and is left untouched.

---

## How the frontend inserts (insert-only, no read-back)

Because the anon role cannot `SELECT`, the app never reads a row back. Instead the
browser **generates the supplier `id` client-side** (`crypto.randomUUID()`) and
sends it in the Gate insert, then carries that same id through Door Selection into
whichever door is used, so the `submissions` insert links via `supplier_id` — with
no SELECT needed anywhere.

- Gate → `insert into suppliers { id, company_name, contact_name, contact_email, has_ecovadis }`
- Door completion → `insert into submissions { supplier_id: <that id>, door_used, answers }`

Inserts use the Supabase JS client **without** `.select()`, so no read-back is
attempted. The Confirmation view is built entirely from browser state and never
queries Supabase (acceptance criterion 9).

---

## Client configuration

The frontend reads two build-time environment variables (Netlify env vars — never
committed):

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://qdqvpctmotquybvtzwzs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon/public key from Supabase → Project Settings → API |

The anon key is public by design (RLS restricts it to inserts) but must still only
ever live as a Netlify env var, never hardcoded in a committed file. The service
role key is never used by the frontend and never written to any project file; it is
used only transiently by the Supabase MCP during schema setup.

---

## Migrations applied

| Name | What it did |
|------|-------------|
| `create_suppliers_and_submissions_insert_only` | Created `suppliers` and `submissions`, the FK + check constraint + index, revoked all and granted insert-only to anon/authenticated, enabled RLS, and added the two INSERT policies. |

## Manual deletion (GDPR)

Deletion requests go to info@thecorporate.com and are handled by The Corporate's team
directly in the Supabase dashboard: locate the record by company name and/or contact
email, delete the `suppliers` row — the linked `submissions` row is removed via
`ON DELETE CASCADE`. No in-app deletion flow exists.
