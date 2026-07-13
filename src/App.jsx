import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Landing from './components/Landing.jsx'
import SupplierGate from './components/SupplierGate.jsx'
import EcovadisAck from './components/EcovadisAck.jsx'
import DoorSelection from './components/DoorSelection.jsx'
import Door1Wizard from './components/Door1Wizard.jsx'
import Door2Upload from './components/Door2Upload.jsx'
import Door2Review from './components/Door2Review.jsx'
import Confirmation from './components/Confirmation.jsx'
import { insertSubmission } from './lib/supabase.js'

// In-app navigation between views. All in-progress state lives in browser memory
// for the duration of the visit and is cleared when the tab closes. The only data
// that leaves the browser are the two Supabase inserts: one `suppliers` row at the
// Gate, and (if a door is completed) one linked `submissions` row. Nothing is read
// back — the id linking them is generated in the browser and carried forward.
const VIEWS = ['landing', 'gate', 'ecovadis', 'doors', 'door1', 'door2', 'review', 'confirm']

export default function App() {
  const [view, setView] = useState('landing')
  const [supplierId, setSupplierId] = useState(null)
  const [door1Answers, setDoor1Answers] = useState({})
  const [door2Result, setDoor2Result] = useState(null)
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [view])

  const go = (next) => {
    if (VIEWS.includes(next)) setView(next)
  }
  const goHome = () => go('landing')

  const setAnswer = (id, value) =>
    setDoor1Answers((prev) => ({ ...prev, [id]: value }))

  // Async submit: insert the linked `submissions` row, then show the on-screen
  // Confirmation (built from browser state — never a read-back). If the insert
  // fails, return the error so the door keeps the answers and lets the supplier
  // retry, rather than losing the record.
  const submitDoor1 = async (answers) => {
    const { error } = await insertSubmission({ supplierId, door: 'door1', answers })
    if (error) return { error }
    setSubmission({ source: 'door1', answers, notes: {} })
    go('confirm')
    return { ok: true }
  }

  const submitDoor2 = async () => {
    const answers = door2Result?.answers || {}
    const { error } = await insertSubmission({ supplierId, door: 'door2', answers })
    if (error) return { error }
    setSubmission({ source: 'door2', answers, notes: door2Result?.notes || {} })
    go('confirm')
    return { ok: true }
  }

  if (view === 'landing') {
    return <Landing onBegin={() => go('gate')} onHome={goHome} />
  }

  return (
    <>
      <Nav onHome={goHome} />
      <div className="app-shell">
        {view === 'gate' && (
          <SupplierGate
            onContinue={({ supplierId: id }) => {
              setSupplierId(id)
              go('doors')
            }}
            onEcovadis={({ supplierId: id }) => {
              setSupplierId(id)
              go('ecovadis')
            }}
            onBack={goHome}
          />
        )}

        {view === 'ecovadis' && <EcovadisAck onHome={goHome} />}

        {view === 'doors' && (
          <DoorSelection
            onDoor1={() => go('door1')}
            onDoor2={() => go('door2')}
            onBack={() => go('gate')}
          />
        )}

        {view === 'door1' && (
          <Door1Wizard
            answers={door1Answers}
            onChange={setAnswer}
            onSubmit={submitDoor1}
            onBack={() => go('doors')}
          />
        )}

        {view === 'door2' && (
          <Door2Upload
            onMatched={(result) => {
              setDoor2Result(result)
              go('review')
            }}
            onBack={() => go('doors')}
          />
        )}

        {view === 'review' && door2Result && (
          <Door2Review
            result={door2Result}
            onSubmit={submitDoor2}
            onReupload={() => go('door2')}
          />
        )}

        {view === 'confirm' && submission && (
          <Confirmation submission={submission} onHome={goHome} />
        )}
      </div>
    </>
  )
}
