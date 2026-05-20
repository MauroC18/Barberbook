import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBarberos, crearCita, getDisponibilidad } from '../services/api'

const generarFechas = () => {
  const fechas = []
  const hoy = new Date()
  for (let i = 1; i <= 21; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() + i)
    if (fecha.getDay() !== 0) fechas.push(fecha)
    if (fechas.length === 12) break
  }
  return fechas
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function PasoIndicador({ pasoActual }) {
  const pasos = ['Barbero', 'Fecha y Hora', 'Resumen', '¡Listo!']
  return (
    <div className="paso-indicador">
      {pasos.map((nombre, i) => {
        const num = i + 1
        const activo = num === pasoActual
        const completo = num < pasoActual
        const estado = completo ? 'completo' : activo ? 'activo' : 'inactivo'
        return (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={`paso-circulo ${estado}`}>
                {completo ? '✓' : num}
              </div>
              <span className={`paso-label ${estado}`}>{nombre}</span>
            </div>
            {i < pasos.length - 1 && (
              <div className={`paso-linea ${completo ? 'completo' : 'inactivo'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function AgendarCita() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const servicio = state?.servicio

  const [paso, setPaso] = useState(1)
  const [barberos, setBarberos] = useState([])
  const [barbero, setBarbero] = useState(null)
  const [fecha, setFecha] = useState(null)
  const [hora, setHora] = useState(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [codigoCita, setCodigoCita] = useState('')
  const [horasDisponibles, setHorasDisponibles] = useState([])
  const [cargandoHoras, setCargandoHoras] = useState(false)

  useEffect(() => {
    getBarberos().then(data => setBarberos(data))
  }, [])

  if (!servicio) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: '#888', marginBottom: '20px' }}>No has seleccionado un servicio.</p>
        <button className="btn-dorado" onClick={() => navigate('/servicios')}>
          Ver Servicios
        </button>
      </div>
    )
  }

  const confirmarCita = async () => {
    if (!nombre.trim() || !telefono.trim()) return alert('Por favor completa tu nombre y teléfono.')

    const resultado = await crearCita({
      nombreCliente: nombre,
      telefono,
      servicioId: servicio.id,
      barberoId: barbero.id,
      fecha: fecha.toISOString().split('T')[0],
      hora
    })

    if (resultado.error) {
      alert(resultado.error)
      return
    }

    setCodigoCita(resultado.cita.codigo)
    setPaso(4)
  }

  const handleSeleccionarFecha = (f) => {
    setFecha(f)
    setHora(null)
    setHorasDisponibles([])
    if (barbero) {
      setCargandoHoras(true)
      getDisponibilidad(barbero.id, f.toISOString().split('T')[0])
        .then(data => {
          setHorasDisponibles(data.horasDisponibles)
          setCargandoHoras(false)
        })
    }
  }

  return (
    <div className="agendar-pagina">

      <div className="agendar-chip">
        <span>✂ {servicio.nombre} — ${servicio.precio.toLocaleString()}</span>
      </div>

      <PasoIndicador pasoActual={paso} />

      {/* PASO 1 — Barbero */}
      {paso === 1 && (
        <div>
          <h2 className="paso-titulo">¿Con quién quieres tu cita?</h2>
          <div className="barberos-grid">
            {barberos.map(b => (
              <div
                key={b.id}
                className={`barbero-card ${barbero?.id === b.id ? 'seleccionado' : ''}`}
                onClick={() => { setBarbero(b); setPaso(2) }}
              >
                <img src={b.foto} alt={b.nombre} className="barbero-foto" />
                <h3 className="barbero-nombre">{b.nombre}</h3>
                <p className="barbero-especialidad">{b.especialidad}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 2 — Fecha y Hora */}
      {paso === 2 && (
        <div>
          <h2 className="paso-titulo">¿Cuándo quieres tu cita?</h2>

          <p className="paso-label-seccion">Selecciona una fecha</p>
          <div className="fechas-container">
            {generarFechas().map((f, i) => (
              <button
                key={i}
                className={`fecha-btn ${fecha?.toDateString() === f.toDateString() ? 'seleccionado' : ''}`}
                onClick={() => handleSeleccionarFecha(f)}
              >
                <div className="fecha-dia">{DIAS[f.getDay()]}</div>
                <div className="fecha-numero">{f.getDate()}</div>
                <div className="fecha-mes">{MESES[f.getMonth()]}</div>
              </button>
            ))}
          </div>

          {fecha && (
            <>
              <p className="paso-label-seccion">Selecciona una hora</p>
              <div className="horarios-container">
                {cargandoHoras ? (
                  <p className="sin-horarios">⏳ Cargando horarios...</p>
                ) : horasDisponibles.length === 0 ? (
                  <p className="sin-horarios">⚠️ No hay horarios disponibles para este día.</p>
                ) : (
                  horasDisponibles.map(h => (
                    <button
                      key={h}
                      className={`hora-btn ${hora === h ? 'seleccionado' : ''}`}
                      onClick={() => setHora(h)}
                    >
                      {h}
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          <div className="btn-group">
            <button className="btn-outline" onClick={() => setPaso(1)}>← Volver</button>
            <button
              className={`btn-dorado ${!hora ? 'deshabilitado' : ''}`}
              onClick={() => hora && setPaso(3)}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* PASO 3 — Resumen */}
      {paso === 3 && (
        <div>
          <h2 className="paso-titulo">Resumen de tu cita</h2>

          <div className="resumen-card">
            {[
              ['✂ Servicio', servicio.nombre],
              ['👤 Barbero', barbero.nombre],
              ['💰 Valor', `$${servicio.precio.toLocaleString()}`],
              ['📅 Fecha', `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`],
              ['🕐 Hora', hora],
              ['⏱ Duración', `${servicio.duracion} minutos`],
            ].map(([label, valor]) => (
              <div key={label} className="resumen-fila">
                <span className="resumen-label">{label}</span>
                <span className="resumen-valor">{valor}</span>
              </div>
            ))}
          </div>

          <p className="paso-label-seccion">Tus datos de contacto</p>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Tu número de teléfono"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="btn-group">
            <button className="btn-outline" onClick={() => setPaso(2)}>← Volver</button>
            <button className="btn-dorado" onClick={confirmarCita}>Confirmar Cita ✓</button>
          </div>
        </div>
      )}

      {/* PASO 4 — Confirmación */}
      {paso === 4 && (
        <div className="confirmacion">
          <div className="confirmacion-emoji">🎉</div>
          <h2 className="confirmacion-titulo">¡Cita Confirmada!</h2>
          <p className="confirmacion-subtitulo">Te esperamos, {nombre.split(' ')[0]}.</p>

          <div className="confirmacion-card">
            <p className="confirmacion-codigo-label">Código de reserva</p>
            <p className="confirmacion-codigo">{codigoCita}</p>
            {[
              ['Servicio', servicio.nombre],
              ['Barbero', barbero.nombre],
              ['Fecha', `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`],
              ['Hora', hora],
              ['Total', `$${servicio.precio.toLocaleString()}`],
            ].map(([label, valor]) => (
              <div key={label} className="resumen-fila">
                <span className="resumen-label">{label}</span>
                <span className="resumen-valor">{valor}</span>
              </div>
            ))}
          </div>

          <button className="btn-dorado" onClick={() => navigate('/servicios')}>
            Volver a Servicios
          </button>
        </div>
      )}
    </div>
  )
}

export default AgendarCita