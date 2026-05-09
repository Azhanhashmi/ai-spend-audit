import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import SharedAudit from './pages/SharedAudit'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/audit/:id" element={<SharedAudit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App