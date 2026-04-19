import { useState } from 'react'

const ICONOS = { 1: '✂️', 2: '🪒', 3: '💈', 4: '🧴' }

function ServicioCard({ servicio, onSeleccionar }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => onSeleccionar(servicio)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: '#1a1a1a',
        border: `1px solid ${hover ? '#c9a84c' : '#2a2a2a'}`,
        borderRadius: '14px', padding: '28px', cursor: 'pointer',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s ease', boxShadow: hover ? '0 8px 30px #c9a84c22' : 'none',
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>{ICONOS[servicio.id] || '✂️'}</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f0f0f0', marginBottom: '8px' }}>
        {servicio.nombre}
      </h3>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        Servicio profesional con productos premium
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2a2a2a', paddingTop: '16px' }}>
        <span style={{ fontSize: '24px', fontWeight: '800', color: '#c9a84c' }}>
          ${servicio.precio.toLocaleString()}
        </span>
        <span style={{ fontSize: '13px', color: '#666', backgroundColor: '#2a2a2a', padding: '4px 12px', borderRadius: '20px' }}>
          ⏱ {servicio.duracion} min
        </span>
      </div>
    </div>
  )
}

export default ServicioCard