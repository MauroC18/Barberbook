import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ServicioCard from '../components/serviciocard'
import { getServicios } from '../services/api'

function Servicios() {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Al cargar la página, trae los servicios del backend
  useEffect(() => {
    getServicios()
      .then(data => {
        setServicios(data)
        setCargando(false)
      })
      .catch(() => {
        setError('No se pudieron cargar los servicios. Verifica que el servidor esté corriendo.')
        setCargando(false)
      })
  }, [])

  const handleSeleccionar = (servicio) => {
    navigate('/agendar', { state: { servicio } })
  }

  if (cargando) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      Cargando servicios...
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#ff4444' }}>
      {error}
    </div>
  )

  return (
    <div className="servicios-pagina">
      <div className="servicios-encabezado">
        <h2 className="servicios-titulo">
          Nuestros <span>Servicios</span>
        </h2>
        <p className="servicios-subtitulo">
          Selecciona el servicio que deseas para comenzar
        </p>
      </div>

      <div className="servicios-grid">
        {servicios.map(s => (
          <ServicioCard key={s.id} servicio={s} onSeleccionar={handleSeleccionar} />
        ))}
      </div>
    </div>
  )
}

export default Servicios