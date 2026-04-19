import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ── Datos ──────────────────────────────────────────────
const BARBEROS = [
  { id: 1, nombre: 'Carlos Mendoza', especialidad: 'Cortes clásicos y modernos', foto: 'https://static.vecteezy.com/system/resources/previews/004/477/337/non_2x/face-young-man-in-frame-circular-avatar-character-icon-free-vector.jpg' },
  { id: 2, nombre: 'Andrés Pérez', especialidad: 'Cortes clásicos y modernos', foto: 'https://thumbs.dreamstime.com/b/avatar-de-trabajador-circular-icono-ilustraci%C3%B3n-cuerpo-superior-persona-negocios-207816638.jpg' },
]

// Genera los próximos 14 días de lunes a sábado
const generarFechas = () => {
  const fechas = []
  const hoy = new Date()
  for (let i = 1; i <= 21; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() + i)
    if (fecha.getDay() !== 0) fechas.push(fecha) // excluir domingos
    if (fechas.length === 12) break
  }
  return fechas
}

// Genera horarios de 9:00am a 7:30pm cada 30 min
const generarHorarios = () => {
  const slots = []
  for (let h = 9; h < 20; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 19 || (h === 19 && true)) slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots.filter(s => s <= '19:30')
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ── Indicador de pasos ─────────────────────────────────
function PasoIndicador({ pasoActual }) {
  const pasos = ['Barbero', 'Fecha y Hora', 'Resumen', '¡Listo!']
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '48px', flexWrap: 'wrap' }}>
      {pasos.map((nombre, i) => {
        const num = i + 1
        const activo = num === pasoActual
        const completo = num < pasoActual
        return (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700',
                backgroundColor: completo ? '#c9a84c' : activo ? '#c9a84c22' : '#1a1a1a',
                color: completo ? '#000' : activo ? '#c9a84c' : '#555',
                border: `2px solid ${activo || completo ? '#c9a84c' : '#333'}`,
                transition: 'all 0.3s',
              }}>
                {completo ? '✓' : num}
              </div>
              <span style={{ fontSize: '13px', color: activo ? '#c9a84c' : completo ? '#c9a84c' : '#555', fontWeight: activo ? '700' : '400' }}>
                {nombre}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div style={{ width: '32px', height: '2px', backgroundColor: completo ? '#c9a84c' : '#333' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Componente principal ───────────────────────────────
function AgendarCita() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const servicio = state?.servicio

  const [paso, setPaso] = useState(1)
  const [barbero, setBarbero] = useState(null)
  const [fecha, setFecha] = useState(null)
  const [hora, setHora] = useState(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [codigoCita, setCodigoCita] = useState('')

  // Si llegaron sin servicio, redirigir
  if (!servicio) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: '#888', marginBottom: '20px' }}>No has seleccionado un servicio.</p>
        <button onClick={() => navigate('/servicios')} style={btnDorado}>Ver Servicios</button>
      </div>
    )
  }

  const confirmarCita = () => {
    if (!nombre.trim() || !telefono.trim()) return alert('Por favor completa tu nombre y teléfono.')
    const codigo = `BB-${Date.now().toString().slice(-6)}`
    setCodigoCita(codigo)
    setPaso(4)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '50px 24px' }}>

      {/* Chip del servicio seleccionado */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{
          backgroundColor: '#c9a84c22', color: '#c9a84c', border: '1px solid #c9a84c44',
          borderRadius: '20px', padding: '6px 18px', fontSize: '14px',
        }}>
          ✂ {servicio.nombre} — ${servicio.precio.toLocaleString()}
        </span>
      </div>

      <PasoIndicador pasoActual={paso} />

      {/* ── PASO 1: Elegir barbero ── */}
      {paso === 1 && (
        <div>
          <h2 style={tituloPaso}>¿Con quién quieres tu cita?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {BARBEROS.map(b => (
              <div
                key={b.id}
                onClick={() => { setBarbero(b); setPaso(2) }}
                style={{
                  backgroundColor: '#1a1a1a', border: `2px solid ${barbero?.id === b.id ? '#c9a84c' : '#2a2a2a'}`,
                  borderRadius: '14px', padding: '28px 20px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.borderColor = barbero?.id === b.id ? '#c9a84c' : '#2a2a2a'}
              >
                <img src={b.foto} alt={b.nombre} style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  objectFit: 'cover', border: '3px solid #c9a84c', marginBottom: '16px',
                }} />
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f0f0f0', marginBottom: '8px' }}>{b.nombre}</h3>
                <p style={{ fontSize: '13px', color: '#888' }}>{b.especialidad}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PASO 2: Elegir fecha y hora ── */}
      {paso === 2 && (
        <div>
          <h2 style={tituloPaso}>¿Cuándo quieres tu cita?</h2>

          {/* Fechas */}
          <p style={labelSeccion}>Selecciona una fecha</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {generarFechas().map((f, i) => {
              const seleccionada = fecha?.toDateString() === f.toDateString()
              return (
                <button key={i} onClick={() => { setFecha(f); setHora(null) }} style={{
                  backgroundColor: seleccionada ? '#c9a84c' : '#1a1a1a',
                  color: seleccionada ? '#000' : '#f0f0f0',
                  border: `1px solid ${seleccionada ? '#c9a84c' : '#333'}`,
                  borderRadius: '10px', padding: '10px 14px', cursor: 'pointer',
                  minWidth: '64px', textAlign: 'center', transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', opacity: 0.7 }}>
                    {DIAS[f.getDay()]}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1.2 }}>
                    {f.getDate()}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>
                    {MESES[f.getMonth()]}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Horarios */}
          {fecha && (
            <>
              <p style={labelSeccion}>Selecciona una hora</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
                {generarHorarios().map(h => (
                  <button key={h} onClick={() => setHora(h)} style={{
                    backgroundColor: hora === h ? '#c9a84c' : '#1a1a1a',
                    color: hora === h ? '#000' : '#f0f0f0',
                    border: `1px solid ${hora === h ? '#c9a84c' : '#333'}`,
                    borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: hora === h ? '700' : '400', transition: 'all 0.2s',
                  }}>
                    {h}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button onClick={() => setPaso(1)} style={btnOutline}>← Volver</button>
            <button
              onClick={() => hora && setPaso(3)}
              style={{ ...btnDorado, opacity: hora ? 1 : 0.4, cursor: hora ? 'pointer' : 'not-allowed' }}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* ── PASO 3: Resumen + datos ── */}
      {paso === 3 && (
        <div>
          <h2 style={tituloPaso}>Resumen de tu cita</h2>

          {/* Tarjeta resumen */}
          <div style={{
            backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '14px', padding: '28px', marginBottom: '32px',
          }}>
            {[
              ['✂ Servicio', servicio.nombre],
              ['👤 Barbero', barbero.nombre],
              ['💰 Valor', `$${servicio.precio.toLocaleString()}`],
              ['📅 Fecha', `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`],
              ['🕐 Hora', hora],
              ['⏱ Duración', `${servicio.duracion} minutos`],
            ].map(([label, valor]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid #2a2a2a',
              }}>
                <span style={{ color: '#888', fontSize: '14px' }}>{label}</span>
                <span style={{ color: '#f0f0f0', fontWeight: '600', fontSize: '15px' }}>{valor}</span>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <p style={labelSeccion}>Tus datos de contacto</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            <input
              type="text" placeholder="Tu nombre completo"
              value={nombre} onChange={e => setNombre(e.target.value)}
              style={inputStyle}
            />
            <input
              type="tel" placeholder="Tu número de teléfono"
              value={telefono} onChange={e => setTelefono(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setPaso(2)} style={btnOutline}>← Volver</button>
            <button onClick={confirmarCita} style={btnDorado}>Confirmar Cita ✓</button>
          </div>
        </div>
      )}

      {/* ── PASO 4: Confirmación ── */}
      {paso === 4 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🎉</div>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#c9a84c', marginBottom: '8px' }}>
            ¡Cita Confirmada!
          </h2>
          <p style={{ color: '#888', marginBottom: '32px' }}>
            Te esperamos, {nombre.split(' ')[0]}.
          </p>

          <div style={{
            backgroundColor: '#1a1a1a', border: '1px solid #c9a84c33',
            borderRadius: '14px', padding: '28px', marginBottom: '32px', textAlign: 'left',
          }}>
            <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '4px' }}>Código de reserva</p>
            <p style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', color: '#c9a84c', marginBottom: '24px', letterSpacing: '4px' }}>
              {codigoCita}
            </p>
            {[
              ['Servicio', servicio.nombre],
              ['Barbero', barbero.nombre],
              ['Fecha', `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`],
              ['Hora', hora],
              ['Total', `$${servicio.precio.toLocaleString()}`],
            ].map(([label, valor]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>{label}</span>
                <span style={{ color: '#f0f0f0', fontWeight: '600' }}>{valor}</span>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/servicios')} style={btnDorado}>
            Volver a Servicios
          </button>
        </div>
      )}
    </div>
  )
}

// ── Estilos compartidos ────────────────────────────────
const tituloPaso = { fontSize: '24px', fontWeight: '800', color: '#f0f0f0', marginBottom: '28px' }
const labelSeccion = { fontSize: '14px', color: '#888', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }
const btnDorado = {
  flex: 1, backgroundColor: '#c9a84c', color: '#000', border: 'none',
  borderRadius: '8px', padding: '14px 24px', fontSize: '15px',
  fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px',
}
const btnOutline = {
  backgroundColor: 'transparent', color: '#c9a84c',
  border: '2px solid #c9a84c', borderRadius: '8px',
  padding: '14px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
}
const inputStyle = {
  backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
  padding: '14px 16px', fontSize: '15px', color: '#f0f0f0',
  outline: 'none', width: '100%',
}

export default AgendarCita