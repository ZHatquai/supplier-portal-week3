import { useRef, useState } from 'react'
import { parseUpload } from '../data/parser.js'
import { WORKBOOK_FILENAME } from '../data/questionnaire.js'

const WORKBOOK_URL = `/assets/${WORKBOOK_FILENAME}`

// Door 2 — Download and Upload. The workbook is a static asset (no data is
// populated server-side). The upload is parsed entirely client-side; a
// structural mismatch is rejected on this same view, naming what did not match.
export default function Door2Upload({ onMatched, onBack }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState(null) // {status:'rejected'|'error', ...}

  const handleFile = async (file) => {
    if (!file) return
    setBusy(true)
    setOutcome(null)
    const result = await parseUpload(file)
    setBusy(false)
    if (result.status === 'matched') {
      onMatched(result)
    } else {
      setOutcome(result)
    }
  }

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
    e.target.value = '' // allow re-selecting the same file
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  return (
    <div className="app-main">
      <button type="button" className="app-backlink" onClick={onBack}>← Back to submission choice</button>

      <div className="app-view-header">
        <p className="tc-subhead">Door 2 · Download and Upload</p>
        <h1 className="tc-h2">Complete the workbook offline, then upload it back.</h1>
      </div>

      <p className="upload-instructions">
        Download the 2026 workbook, complete it in Excel, and upload the finished file below. The
        portal checks the file structure and shows you a review before anything is submitted. The
        file is read in your browser only — it is never uploaded to a server or stored.
      </p>

      {/* Rejection / error, shown on this same view */}
      {outcome?.status === 'rejected' && (
        <div className="reject-panel" role="alert">
          <div className="reject-panel-tag"><span>File not accepted</span></div>
          <div className="reject-panel-title">
            This file does not match the 2026 template.
          </div>
          <div className="reject-panel-body">
            {outcome.fileName && <div style={{ marginBottom: 6 }}>File: {outcome.fileName}</div>}
            <ul>
              {outcome.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <div style={{ marginTop: 12 }}>
              Download the template below to start from the correct file, then upload again.
            </div>
          </div>
        </div>
      )}
      {outcome?.status === 'error' && (
        <div className="reject-panel" role="alert">
          <div className="reject-panel-tag"><span>File not accepted</span></div>
          <div className="reject-panel-body">{outcome.message}</div>
        </div>
      )}

      {/* Step 1 — download */}
      <div className="upload-block">
        <div className="upload-block-num">Step 1</div>
        <div className="upload-block-title">Download the questionnaire</div>
        <div className="upload-block-body">
          The complete 2026 workbook, with all seven sections, data-validated dropdowns, and
          instructions. This is the only file the upload accepts.
        </div>
        <a
          href={WORKBOOK_URL}
          download={WORKBOOK_FILENAME}
          className="tc-btn-secondary"
        >
          Download Questionnaire (Excel)
        </a>
      </div>

      {/* Step 2 — upload */}
      <div className="upload-block">
        <div className="upload-block-num">Step 2</div>
        <div className="upload-block-title">Upload your completed file</div>
        <div className="upload-block-body">
          Accepted formats: .xlsx or .csv. Blank cells are fine — you review everything before
          submitting.
        </div>

        <div
          className={'upload-dropzone' + (dragging ? ' dragging' : '')}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <button
            type="button"
            className="tc-btn-primary"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? 'Reading file…' : 'Choose file'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={onInputChange}
            style={{ display: 'none' }}
          />
          <div className="upload-dropzone-label">or drag and drop it here</div>
          <div className="upload-formats">.xlsx or .csv · read in your browser · nothing is stored</div>
        </div>
      </div>
    </div>
  )
}
