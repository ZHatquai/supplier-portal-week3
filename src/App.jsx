import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Landing from './components/Landing.jsx'
import DoorSelection from './components/DoorSelection.jsx'
import Door1Wizard from './components/Door1Wizard.jsx'
import Door2Upload from './components/Door2Upload.jsx'
import Door2Review from './components/Door2Review.jsx'
import Confirmation from './components/Confirmation.jsx'

// In-app navigation between views. All state lives in browser memory for the
// duration of the visit and is cleared when the tab closes. No router, no URLs,
// no persistence — one deployed React site with several views.
const VIEWS = ['landing', 'doors', 'door1', 'door2', 'review', 'confirm']

export default function App() {
  const [view, setView] = useState('landing')
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

  const submitDoor1 = (answers) => {
    setSubmission({ source: 'door1', answers, notes: {} })
    go('confirm')
  }

  const submitDoor2 = () => {
    setSubmission({
      source: 'door2',
      answers: door2Result?.answers || {},
      notes: door2Result?.notes || {},
    })
    go('confirm')
  }

  if (view === 'landing') {
    return <Landing onComplete={() => go('doors')} onHome={goHome} />
  }

  return (
    <>
      <Nav onHome={goHome} />
      <div className="app-shell">
        {view === 'doors' && (
          <DoorSelection
            onDoor1={() => go('door1')}
            onDoor2={() => go('door2')}
            onBack={goHome}
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
