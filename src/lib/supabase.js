// Supabase client — the only network egress in this tool.
//
// Tier 2, A1: no login. The browser uses the public anon key, which RLS restricts
// to INSERT-only on `suppliers` and `submissions` (see docs/supabase-setup.md).
// Both values come from Netlify build-time env vars — never hardcoded, never
// committed. See .env.example.
//
// The app never reads a row back: it generates the supplier id client-side and
// carries it forward, so no SELECT is ever attempted and the anon key needs no
// read permission.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Surface a clear console warning in a misconfigured deploy rather than a cryptic
// runtime error deep inside an insert.
if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      '(Netlify → Environment variables). Gate and questionnaire submission will fail until they are set.',
  )
}

export const supabaseReady = Boolean(url && anonKey)

// No auth session to persist — this tool never logs anyone in.
export const supabase = createClient(url || '', anonKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Generate a supplier id in the browser so the row can be inserted and linked to a
// later submission without ever needing to read it back (anon has no SELECT).
export function newSupplierId() {
  return crypto.randomUUID()
}

// Insert the Gate row. Insert-only: no .select(), so no read-back is attempted.
// Returns { error } — the caller keeps the supplier on the Gate and lets them
// retry Continue if error is non-null (never route onward without a saved record).
export async function insertSupplier({ id, companyName, contactName, contactEmail, hasEcovadis }) {
  if (!supabaseReady) {
    return { error: new Error('Supabase is not configured for this deployment.') }
  }
  const { error } = await supabase.from('suppliers').insert({
    id,
    company_name: companyName,
    contact_name: contactName,
    contact_email: contactEmail,
    has_ecovadis: hasEcovadis,
  })
  return { error }
}

// Insert the questionnaire row, linked to the Gate visit via supplier_id.
// door: 'door1' | 'door2' → stored as the workbook-agnostic door_used enum.
export async function insertSubmission({ supplierId, door, answers }) {
  if (!supabaseReady) {
    return { error: new Error('Supabase is not configured for this deployment.') }
  }
  const doorUsed = door === 'door1' ? 'door_1_guided' : 'door_2_upload'
  const { error } = await supabase.from('submissions').insert({
    supplier_id: supplierId,
    door_used: doorUsed,
    answers,
  })
  return { error }
}
