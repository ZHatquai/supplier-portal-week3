// ─────────────────────────────────────────────────────────────────────────────
// Door 2 parser — reads an uploaded .xlsx or .csv entirely in the browser and
// checks it against the 2026 template. Strict on structure, lenient on
// completeness: blank answer cells are accepted and shown as empty in Review;
// only a structural mismatch blocks a file.
//
// No network call. The File is read with the File API and parsed with SheetJS.
// Nothing is uploaded and nothing is retained after parsing.
// ─────────────────────────────────────────────────────────────────────────────

import * as XLSX from 'xlsx'
import {
  SECTIONS,
  ALL_QUESTIONS,
  HEADER_ROW,
  RESPONSE_COL,
  NOTES_COL,
} from './questionnaire.js'

export const ACCEPTED_EXTENSIONS = ['.xlsx', '.csv']

const norm = (v) => String(v ?? '').replace(/\s+/g, ' ').trim()
const normLower = (v) => norm(v).toLowerCase()
const shorten = (s, n = 64) => {
  const t = norm(s)
  return t.length > n ? `${t.slice(0, n - 1)}…` : t
}

function hasAcceptedExtension(name) {
  const lower = (name || '').toLowerCase()
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

// Locate the header row (workbook row 3). Returns its index, or -1.
function findHeaderRow(rows) {
  const target = HEADER_ROW.map(normLower)
  return rows.findIndex((row) => target.every((cell, i) => normLower(row[i]) === cell))
}

// If the exact header wasn't found, try to locate a row that is *meant* to be the
// header (col A = "SECTION") so we can name exactly which columns were changed.
function diffHeaderRow(rows) {
  const candidate = rows.find((row) => normLower(row[0]) === 'section')
  if (!candidate) return null
  const diffs = []
  HEADER_ROW.forEach((expected, i) => {
    if (normLower(candidate[i]) !== normLower(expected)) {
      const found = norm(candidate[i]) || '(empty)'
      diffs.push(`column ${i + 1} should read “${expected}” but reads “${found}”`)
    }
  })
  return diffs
}

// Main entry. Resolves to one of:
//   { status: 'matched',  answers, notes, fileName }
//   { status: 'rejected', reasons: string[], fileName }
//   { status: 'error',    message, fileName }
export async function parseUpload(file) {
  const fileName = file?.name || 'file'

  if (!hasAcceptedExtension(fileName)) {
    return {
      status: 'error',
      fileName,
      message:
        'That file type is not accepted. Upload the completed workbook as .xlsx or .csv.',
    }
  }

  const isCsv = fileName.toLowerCase().endsWith('.csv')
  let workbook
  try {
    const buffer = await file.arrayBuffer()
    if (isCsv) {
      // Decode as UTF-8 text first — reading CSV bytes as a binary array skips
      // UTF-8 decoding and corrupts characters such as the en dash in "S2–S7".
      const text = new TextDecoder('utf-8').decode(new Uint8Array(buffer))
      workbook = XLSX.read(text, { type: 'string' })
    } else {
      workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
    }
  } catch {
    return {
      status: 'error',
      fileName,
      message:
        'The file could not be read. It may be empty or corrupt. Download the template and try again.',
    }
  }

  const sheetName = workbook.SheetNames?.[0]
  const sheet = sheetName && workbook.Sheets[sheetName]
  if (!sheet) {
    return {
      status: 'error',
      fileName,
      message:
        'The file could not be read. It may be empty or corrupt. Download the template and try again.',
    }
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: true,
    raw: false,
  })

  // ── Structural check 1: the header row ──────────────────────────────────
  const headerIndex = findHeaderRow(rows)
  if (headerIndex === -1) {
    const diffs = diffHeaderRow(rows)
    const reasons =
      diffs && diffs.length
        ? [`The column headers do not match the 2026 template: ${diffs.join('; ')}.`]
        : [
            'The column header row could not be found. The 2026 template must keep the ' +
              'row: SECTION · ESRS REF · TYPE · QUESTION / METRIC · SUPPLIER RESPONSE · ' +
              'NOTES / EVIDENCE · STATUS.',
          ]
    return { status: 'rejected', fileName, reasons }
  }

  // ── Collect the question rows ───────────────────────────────────────────
  // A question row has: col A = S1–S7, a non-empty TYPE (col C), and a question
  // label (col D). Section-title rows share the section id in col A but leave
  // TYPE blank, so the TYPE check excludes them; the DECLARATION row is excluded
  // because its col A is not a section id.
  const answerRows = []
  for (let r = headerIndex + 1; r < rows.length; r++) {
    const row = rows[r]
    const sectionCell = norm(row[0]).toUpperCase()
    const typeCell = norm(row[2])
    const questionCell = norm(row[3])
    if (/^S[1-7]$/.test(sectionCell) && typeCell !== '' && questionCell !== '') {
      answerRows.push({
        section: sectionCell,
        label: questionCell,
        response: row[RESPONSE_COL],
        notes: row[NOTES_COL],
      })
    }
  }

  // ── Structural check 2: every section present ───────────────────────────
  const present = new Set(answerRows.map((r) => r.section))
  const missingSections = SECTIONS.filter((s) => !present.has(s.id))
  if (missingSections.length) {
    return {
      status: 'rejected',
      fileName,
      reasons: missingSections.map(
        (s) => `Section ${s.id} (${s.title}) is missing or was renamed.`
      ),
    }
  }

  // ── Structural check 3: questions match, in order ───────────────────────
  const expected = ALL_QUESTIONS
  const reasons = []
  const limit = Math.min(expected.length, answerRows.length)
  for (let i = 0; i < limit; i++) {
    const exp = expected[i]
    const got = answerRows[i]
    const expLabel = exp.matchLabel || exp.label
    if (got.section !== exp.section || normLower(got.label) !== normLower(expLabel)) {
      reasons.push(
        `A question in ${exp.section} does not match the template. Expected “${shorten(
          expLabel
        )}” but found ${got.section} “${shorten(got.label)}”.`
      )
      break
    }
  }
  if (answerRows.length !== expected.length) {
    reasons.push(
      `The template has ${expected.length} questions across S1–S7; this file has ${answerRows.length}.`
    )
  }
  if (reasons.length) {
    return { status: 'rejected', fileName, reasons }
  }

  // ── Matched: map responses by question id, blanks kept as empty ─────────
  const answers = {}
  const notes = {}
  expected.forEach((q, i) => {
    const row = answerRows[i]
    answers[q.id] = row.response == null ? '' : String(row.response).trim()
    const note = row.notes == null ? '' : String(row.notes).trim()
    if (note !== '') notes[q.id] = note
  })

  return { status: 'matched', fileName, answers, notes }
}
