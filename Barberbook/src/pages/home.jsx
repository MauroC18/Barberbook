import { Link } from 'react-router-dom'

function Home() {
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '91vh', textAlign: 'center',
      padding: '40px 20px', background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
    }}>
      <span style={{
        backgroundColor: '#c9a84c22', color: '#c9a84c', border: '1px solid #c9a84c',
        borderRadius: '20px', padding: '6px 18px', fontSize: '13px',
        letterSpacing: '2px', marginBottom: '24px', textTransform: 'uppercase',
      }}>
        ✂ Barbería Premium
      </span>

      <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
        Tu estilo,<br />
        <span style={{ color: '#c9a84c' }}>tu horario.</span>
      </h1>

      <p style={{ fontSize: '18px', color: '#aaa', maxWidth: '480px', lineHeight: '1.7', marginBottom: '40px' }}>
        Agenda tu cita en segundos. Sin llamadas, sin filas. El mejor servicio de barbería, ahora en tu mano.
      </p>

      <Link to="/servicios">
        <button style={{
          backgroundColor: '#c9a84c', color: '#0f0f0f', border: 'none',
          borderRadius: '8px', padding: '16px 40px', fontSize: '17px',
          fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px',
        }}>
          Ver Servicios →
        </button>
      </Link>

      <div style={{ display: 'flex', gap: '60px', marginTop: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[['+ 500', 'Clientes'], ['4', 'Servicios'], ['2', 'Barberos'], ['4.9 ★', 'Calificación']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#c9a84c' }}>{num}</p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Home