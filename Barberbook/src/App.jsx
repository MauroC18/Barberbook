import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import Servicios from './pages/servicios'
import AgendarCita from './pages/agendar_cita'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/agendar" element={<AgendarCita />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App