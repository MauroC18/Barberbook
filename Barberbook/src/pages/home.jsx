import { useNavigate } from 'react-router-dom'

const STATS = [
  ['+ 500', 'Clientes'],
  ['4', 'Servicios'],
  ['2', 'Barberos'],
  ['4.9 ★', 'Calificación'],
]

function Home() {
  const navigate = useNavigate()

  return (
    <section className="home-hero">
      <span className="home-badge">✂ Barbería Premium</span>

      <h1 className="home-titulo">
        Tu estilo,<br />
        <span>tu horario.</span>
      </h1>

      <p className="home-subtitulo">
        Agenda tu cita en segundos. Sin llamadas, sin filas.
        El mejor servicio de barbería, ahora en tu mano.
      </p>

      <button className="btn-dorado" onClick={() => navigate('/servicios')}>
        Ver Servicios →
      </button>

      <div className="home-stats">
        {STATS.map(([num, label]) => (
          <div key={label}>
            <p className="home-stat-numero">{num}</p>
            <p className="home-stat-label">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Home