// ─────────────────────────────────────────────────────────────────────────────
// The Corporate Supplier Questionnaire 2026 — single source of truth.
//
// Every label, section, ESRS reference, input type, dropdown list, unit, and
// required flag below is derived directly from
//   public/assets/The_Corporate_Supplier_Questionnaire_2026.xlsx
//   (sheet "Supplier Assessment 2026", columns A–G).
//
// Both Door 1 (the guided form) and Door 2 (the upload parser) read this file.
// Neither is hand-authored independently of the workbook.
//
// Column map in the workbook (header row 3):
//   A SECTION · B ESRS REF · C TYPE · D QUESTION / METRIC ·
//   E SUPPLIER RESPONSE · F NOTES / EVIDENCE · G STATUS
//
// TYPE → input:  Required/Conditional → text · Dropdown → select ·
//                Quantitative → number(+unit) · Open-Ended → textarea
//
// Note on S2 Scope 2 (workbook cell E12): the TYPE column marks it Quantitative
// yet the cell also carries a stray data-validation list
// ("Verified by Third Party / Internally Calculated / Estimated / Not Tracked").
// The TYPE column is authoritative and matches Scope 1 and Scope 3, so it renders
// as a number+unit input. Recorded as a build decision.
// ─────────────────────────────────────────────────────────────────────────────

export const WORKBOOK_FILENAME = 'The_Corporate_Supplier_Questionnaire_2026.xlsx'
export const SHEET_NAME = 'Supplier Assessment 2026'

// Exact header row (workbook row 3) the Door 2 parser matches against.
export const HEADER_ROW = [
  'SECTION',
  'ESRS REF',
  'TYPE',
  'QUESTION / METRIC',
  'SUPPLIER RESPONSE',
  'NOTES / EVIDENCE',
  'STATUS',
]

// Response-column index within a matched row (0-based): column E.
export const RESPONSE_COL = 4
export const NOTES_COL = 5

// Bypass routing (workbook S1 Q3 / cell E8).
export const BYPASS_QUESTION_ID = 'S1Q3'
export const BYPASS_YES = 'Yes — Scorecard Attached'
export const BYPASS_NO = 'No — Will Complete Questionnaire'

const YES_NO = ['Yes', 'No']

// requiredMode:
//   'always'       — required in every case
//   'ifScorecard'  — required only when S1 Q3 = "Yes — Scorecard Attached"
//   'unlessBypass' — required unless the supplier took the EcoVadis bypass
//   'never'        — never blocks progress
export const SECTIONS = [
  {
    id: 'S1',
    title: 'General Information & EcoVadis Bypass',
    esrs: 'All ESRS',
    questions: [
      {
        id: 'S1Q1', row: 6, ref: '—', input: 'text', requiredMode: 'always',
        label: 'Legal name and registered country of the responding entity.',
      },
      {
        id: 'S1Q2', row: 7, ref: '—', input: 'text', requiredMode: 'always',
        label: 'Primary contact name, title, and email address for this assessment.',
      },
      {
        id: 'S1Q3', row: 8, ref: 'Bypass', input: 'select', requiredMode: 'always',
        options: [BYPASS_YES, BYPASS_NO],
        // Door 1 shows the question and the guidance separately; the parser
        // matches against the full workbook cell text (matchLabel).
        label:
          'Do you hold a valid EcoVadis Sustainability Scorecard (issued within the last 12 months)?',
        help:
          'If YES: attach the scorecard link below and proceed directly to submit. Sections S2–S7 are not required.',
        matchLabel:
          'Do you hold a valid EcoVadis Sustainability Scorecard (issued within the last 12 months)?\n\nIf YES: attach scorecard link in the Notes column and proceed directly to the Status column. Sections S2–S7 are not required.',
      },
      {
        id: 'S1Q4', row: 9, ref: '—', input: 'text', requiredMode: 'ifScorecard',
        label: 'EcoVadis Scorecard Link (if applicable). Paste URL or attach document reference.',
      },
    ],
  },
  {
    id: 'S2',
    title: 'Climate & Decarbonisation',
    esrs: 'ESRS E1',
    questions: [
      {
        id: 'S2Q1', row: 11, ref: 'E1-4', input: 'number', unit: 'tCO₂e', requiredMode: 'unlessBypass',
        label: 'Total Scope 1 emissions for last fiscal year (metric tonnes CO₂e). Include verification method.',
      },
      {
        id: 'S2Q2', row: 12, ref: 'E1-4', input: 'number', unit: 'tCO₂e', requiredMode: 'unlessBypass',
        label: 'Total Scope 2 emissions for last fiscal year — market-based (metric tonnes CO₂e).',
      },
      {
        id: 'S2Q3', row: 13, ref: 'E1-4', input: 'number', unit: 'tCO₂e', requiredMode: 'unlessBypass',
        label: 'Total Scope 3 emissions for last fiscal year (metric tonnes CO₂e). Specify categories included.',
      },
      {
        id: 'S2Q4', row: 14, ref: 'E1-3', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Does your organisation have a Science-Based Target (SBTi) validated decarbonisation target?',
      },
      {
        id: 'S2Q5', row: 15, ref: 'E1-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Describe your top three decarbonisation projects currently in progress or planned for the next 24 months. Include estimated tCO₂e reduction and the specific technology being utilised (e.g., electrification of heat, on-site renewables).',
      },
      {
        id: 'S2Q6', row: 16, ref: 'E1-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'What are the primary technical or financial barriers preventing you from reaching a 50% reduction in Scope 1 and 2 emissions by 2030?',
      },
    ],
  },
  {
    id: 'S3',
    title: 'Pollution & PFAS',
    esrs: 'ESRS E2',
    questions: [
      {
        id: 'S3Q1', row: 18, ref: 'E2-3', input: 'number', unit: 'kg', requiredMode: 'unlessBypass',
        label: 'Total weight of substances of concern (REACH, SVHC list) used in production last fiscal year (kg).',
      },
      {
        id: 'S3Q2', row: 19, ref: 'E2-3', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Do any of your products or production processes contain or utilise PFAS compounds ("Forever Chemicals")?',
        help: 'A "Yes" answer triggers The Corporate\'s PFAS Risk review.',
      },
      {
        id: 'S3Q3', row: 20, ref: 'E2-3', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'If your products contain PFAS, detail your substitution roadmap. Have you identified viable non-PFAS alternatives? Provide your target date for a complete phase-out.',
      },
      {
        id: 'S3Q4', row: 21, ref: 'E2-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Describe your industrial wastewater treatment process. What specific measures are in place to ensure zero leakage of hazardous chemicals into local water systems?',
      },
    ],
  },
  {
    id: 'S4',
    title: 'Water & Marine Resources',
    esrs: 'ESRS E3',
    questions: [
      {
        id: 'S4Q1', row: 23, ref: 'E3-1', input: 'number', unit: 'm³', requiredMode: 'unlessBypass',
        label: 'Total water withdrawal last fiscal year (m³). Specify source (municipal, groundwater, surface).',
      },
      {
        id: 'S4Q2', row: 24, ref: 'E3-1', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Is your primary production facility located in a high-water-stress region (WRI Aqueduct score ≥3)?',
      },
      {
        id: 'S4Q3', row: 25, ref: 'E3-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Provide details on any water-saving or closed-loop recycling projects implemented at your facility. How has your total water intensity (litres per unit produced) changed over the last three years?',
      },
      {
        id: 'S4Q4', row: 26, ref: 'E3-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'If your facility is in a high-water-stress region, what is your operational contingency plan for severe drought conditions to ensure supply continuity to The Corporate?',
      },
    ],
  },
  {
    id: 'S5',
    title: 'Circular Economy & Waste',
    esrs: 'ESRS E5',
    questions: [
      {
        id: 'S5Q1', row: 28, ref: 'E5-2', input: 'number', unit: 'tonnes', requiredMode: 'unlessBypass',
        label: 'Total waste generated last fiscal year (tonnes). Breakdown: landfill / recycled / energy recovery / hazardous.',
      },
      {
        id: 'S5Q2', row: 29, ref: 'E5-4', input: 'number', unit: '%', requiredMode: 'unlessBypass',
        label: 'Percentage of post-consumer recycled (PCR) content in the components supplied to The Corporate (%).',
      },
      {
        id: 'S5Q3', row: 30, ref: 'E5-3', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'How are you incorporating circularity into the specific components you supply to The Corporate? Examples: design for disassembly, modularity, or increasing PCR content.',
      },
      {
        id: 'S5Q4', row: 31, ref: 'E5-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Detail your strategy for achieving Zero Waste to Landfill. What are your primary waste streams, and what innovative recycling or upcycling initiatives have you launched recently?',
      },
    ],
  },
  {
    id: 'S6',
    title: 'Biodiversity & Ecosystems',
    esrs: 'ESRS E4',
    questions: [
      {
        id: 'S6Q1', row: 33, ref: 'E4-2', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Are any of your production sites located within or adjacent to (within 1 km) a protected area or biodiversity hotspot?',
      },
      {
        id: 'S6Q2', row: 34, ref: 'E4-3', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Describe any initiatives taken to minimise the impact of your operations on local biodiversity. Include land-use management, native planting schemes, or light/noise pollution reduction.',
      },
      {
        id: 'S6Q3', row: 35, ref: 'E4-5', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Have you undertaken a biodiversity impact assessment (TNFD or equivalent) for your primary production sites? If yes, share key findings. If no, provide your target assessment date.',
      },
    ],
  },
  {
    id: 'S7',
    title: 'Social, Labour & Governance',
    esrs: 'ESRS S2 · G1',
    questions: [
      {
        id: 'S7Q1', row: 37, ref: 'S2-1', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights?',
      },
      {
        id: 'S7Q2', row: 38, ref: 'S2-2', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months?',
      },
      {
        id: 'S7Q3', row: 39, ref: 'S2-4', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Describe the grievance mechanism available to workers in your supply chain. How many grievances were filed and resolved in the last 12 months?',
      },
      {
        id: 'S7Q4', row: 40, ref: 'G1-1', input: 'select', options: YES_NO, requiredMode: 'unlessBypass',
        label: 'Does your organisation have a verified conflict minerals policy (3TG — tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance?',
      },
      {
        id: 'S7Q5', row: 41, ref: 'G1-2', input: 'textarea', requiredMode: 'unlessBypass',
        label:
          'Describe your supplier code of conduct and how compliance is monitored across your own supply chain. Include details of any third-party audits conducted in the last 24 months.',
      },
    ],
  },
]

// Flat, ordered list of every question — used by the parser to match rows.
export const ALL_QUESTIONS = SECTIONS.flatMap((s) =>
  s.questions.map((q) => ({ ...q, section: s.id }))
)

export function isBypassed(answers) {
  return (answers?.[BYPASS_QUESTION_ID] || '').trim() === BYPASS_YES
}

// Is this field required, given the current answers?
export function isRequired(question, answers) {
  switch (question.requiredMode) {
    case 'always':
      return true
    case 'ifScorecard':
      return (answers?.[BYPASS_QUESTION_ID] || '').trim() === BYPASS_YES
    case 'unlessBypass':
      return !isBypassed(answers)
    default:
      return false
  }
}

// Accepts "1,234.5" style thousands separators; rejects any non-numeric text.
export function isNumeric(value) {
  const cleaned = String(value).replace(/[,\s]/g, '')
  if (cleaned === '') return false
  return Number.isFinite(Number(cleaned))
}

// Returns an inline error string, or '' if the value is valid.
export function validateField(question, rawValue, answers) {
  const value = (rawValue ?? '').toString().trim()
  const required = isRequired(question, answers)

  if (value === '') {
    return required ? 'This field is required.' : ''
  }

  if (question.input === 'select') {
    if (!question.options.includes(value)) {
      return 'Select one of the listed values.'
    }
  }

  if (question.input === 'number' && !isNumeric(value)) {
    return question.unit
      ? `Enter a number${question.unit ? ` in ${question.unit}` : ''}.`
      : 'Enter a number.'
  }

  return ''
}

// Validate every question in a section. Returns { [questionId]: errorString }.
export function validateSection(section, answers) {
  const errors = {}
  for (const q of section.questions) {
    const err = validateField(q, answers[q.id], answers)
    if (err) errors[q.id] = err
  }
  return errors
}

export function sectionHasErrors(section, answers) {
  return Object.keys(validateSection(section, answers)).length > 0
}
