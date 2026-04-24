import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/home'
import Servicios from './pages/servicios'
import AgendarCita from './pages/agendar_cita'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import RutaProtegida from './components/RutaProtegida'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas del cliente — con Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/servicios" element={<><Navbar /><Servicios /></>} />
        <Route path="/agendar" element={<><Navbar /><AgendarCita /></>} />

        {/* Rutas del admin — sin Navbar */}
        <Route path="/admin" element={<Login />} />
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