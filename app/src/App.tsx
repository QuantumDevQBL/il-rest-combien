import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
    </Routes>
  )
}
