import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { Resources, Versions } from '../pages'

const VersionsWrapper = () => {
  const location = useLocation()
  const state = location.state as { externalId: string | undefined }

  return <Versions externalId={state?.externalId} />
}

export const App = () => {
  return (
    <Router>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Resources />} />
          <Route path="/:id" element={<VersionsWrapper />} />
        </Routes>
      </div>
    </Router>
  )
}
