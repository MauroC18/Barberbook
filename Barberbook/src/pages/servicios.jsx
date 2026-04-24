import { useNavigate } from 'react-router-dom'
import ServicioCard from '../components/ServicioCard'

const SERVICIOS = [
  { id: 1, nombre: 'Corte de cabello', duracion: 30, precio: 15000 },
  { id: 2, nombre: 'Arreglo de barba', duracion: 20, precio: 10000 },
  { id: 3, nombre: 'Corte + Barba', duracion: 50, precio: 22000 },
  { id: 4, nombre: 'Afeitado clásico', duracion: 25, precio: 12000 },
]

function Servicios() {
  const navigate = useNavigate()

  const handleSeleccionar = (servicio) => {
    navigate('/agendar', { state: { servicio } })
  }

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
        {SERVICIOS.map(s => (
          <ServicioCard key={s.id} servicio={s} onSeleccionar={handleSeleccionar} />
        ))}
      </div>
    </div>
  )
}

export default Servicios