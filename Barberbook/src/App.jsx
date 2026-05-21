import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/admin/login'
import Home from './pages/home'
import Servicios from './pages/servicios'
import AgendarCita from './pages/agendar_cita'
import Dashboard from './pages/admin/dashboard'
import RutaProtegida from './components/rutaprotegida'
import Navbar from './components/navbar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<><Navbar /><Home /></>} />
        <Route path="/servicios" element={<><Navbar /><Servicios /></>} />
        <Route path="/agendar" element={<><Navbar /><AgendarCita /></>} />
        <Route path="/admin/dashboard" element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App