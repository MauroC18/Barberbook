import { useNavigate } from 'react-router-dom'
import ServicioCard from '../components/serviciocard'

const SERVICIOS = [
  { id: 1, nombre: 'Corte de cabello', duracion: 30, precio: 20000 },
  { id: 2, nombre: 'Arreglo de barba', duracion: 20, precio: 15000 },
  { id: 3, nombre: 'Corte + Barba', duracion: 50, precio: 30000 },
  { id: 4, nombre: 'Afeitado clásico', duracion: 25, precio: 10000 },
]

function Servicios() {
  const navigate = useNavigate()

  const handleSeleccionar = (servicio) => {
    // Pasamos el servicio elegido a la página de agendar mediante el estado de navegación
    navigate('/agendar', { state: { servicio } })
  }

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '12px' }}>
          Nuestros <span style={{ color: '#c9a84c' }}>Servicios</span>
        </h2>
        <p style={{ color: '#888', fontSize: '16px' }}>
          Selecciona el servicio que deseas para comenzar
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
      }}>
        {SERVICIOS.map(s => (
          <ServicioCard key={s.id} servicio={s} onSeleccionar={handleSeleccionar} />
        ))}
      </div>
    </div>
  )
}

export default Servicios