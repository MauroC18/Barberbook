import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCitas, actualizarEstadoCita, getServicios, crearServicio, actualizarServicio, eliminarServicio, eliminarCita } from '../../services/api'

const BARBEROS = [
  { id: 1, nombre: 'Carlos Mendoza' },
  { id: 2, nombre: 'Andrés Pérez' },
]

const ESTADOS = ['pendiente', 'confirmada', 'completada', 'cancelada']

const ESTADO_ESTILOS = {
  pendiente:  { bg: '#c9a84c22', color: '#c9a84c', label: '⏳ Pendiente' },
  confirmada: { bg: '#22c95522', color: '#22c955', label: '✅ Confirmada' },
  completada: { bg: '#2e75b622', color: '#2e75b6', label: '🏁 Completada' },
  cancelada:  { bg: '#ff444422', color: '#ff4444', label: '❌ Cancelada' },
}

function Dashboard() {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('citas')
  const [filtroBarbero, setFiltroBarbero] = useState('todos')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [citas, setCitas] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', duracion: '', precio: '' })
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const [citasData, serviciosData] = await Promise.all([
      getCitas(),
      getServicios()
    ])
    setCitas(citasData)
    setServicios(serviciosData)
    setCargando(false)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('adminSession')
    navigate('/')
  }

  const handleCambiarEstado = async (id, nuevoEstado) => {
    await actualizarEstadoCita(id, nuevoEstado)
    setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c))
  }

  const handleAgregarServicio = async () => {
    if (!nuevoServicio.nombre || !nuevoServicio.duracion || !nuevoServicio.precio) return
    const creado = await crearServicio(nuevoServicio)
    setServicios(prev => [...prev, creado])
    setNuevoServicio({ nombre: '', duracion: '', precio: '' })
  }

  const handleEliminarServicio = async (id) => {
    await eliminarServicio(id)
    setServicios(prev => prev.filter(s => s.id !== id))
  }

  const handleGuardarEdicion = async () => {
    const actualizado = await actualizarServicio(editando.id, editando)
    setServicios(prev => prev.map(s => s.id === editando.id ? actualizado : s))
    setEditando(null)
  }

const ahora = new Date()
const fechaHoy = ahora.toISOString().split('T')[0]
const horaAhora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`

const citasActivas = citas.filter(c => {
  // Ocultar canceladas
  if (c.estado === 'cancelada') return false
  // Ocultar completadas y las que ya pasaron
  if (c.estado === 'completada') return false
  if (c.fecha < fechaHoy) return false
  if (c.fecha === fechaHoy && c.hora < horaAhora) return false
  return true
})

const citasFiltradas = citasActivas.filter(c => {
  const porBarbero = filtroBarbero === 'todos' || c.barberoId === Number(filtroBarbero)
  const porFecha = filtroFecha === '' || c.fecha === filtroFecha
  const porEstado = filtroEstado === 'todos' || c.estado === filtroEstado
  return porBarbero && porFecha && porEstado
})

  const handleEliminarCita = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return
    await eliminarCita(id)
    setCitas(prev => prev.filter(c => c.id !== id))
  }

  const getNombreBarbero = (id) => BARBEROS.find(b => b.id === id)?.nombre || 'N/A'
  const getNombreServicio = (id) => servicios.find(s => s.id === id)?.nombre || 'N/A'

  if (cargando) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      Cargando datos...
    </div>
  )

  return (
    <div className="dashboard-pagina">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">✂ BarberBook</div>
        <p className="sidebar-rol">Administrador</p>
        <nav className="sidebar-nav">
          {[
            { id: 'citas', label: '📋 Citas del día' },
            { id: 'barberos', label: '💈 Por barbero' },
            { id: 'servicios', label: '✂ Servicios' },
            { id: 'calendario', label: '📅 Calendario' },
          ].map(item => (
            <button
              key={item.id}
              className={`sidebar-btn ${seccion === item.id ? 'activo' : ''}`}
              onClick={() => setSeccion(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={cerrarSesion}>
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="dashboard-main">

        {/* ── SECCIÓN: Citas ── */}
        {seccion === 'citas' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-titulo">Citas</h2>
              <span className="dashboard-badge">{citasFiltradas.length} citas</span>
            </div>

          <div className="filtros-container">
            <input
            type="date"
            className="filtro-fecha"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            />
            <select
              className="filtro-select"
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="confirmada">✅ Confirmada</option>
              <option value="completada">🏁 Completada</option>
              <option value="cancelada">❌ Cancelada</option>
            </select>
            {(filtroFecha || filtroEstado !== 'todos') && (
              <button
                className="filtro-limpiar"
                onClick={() => { setFiltroFecha(''); setFiltroEstado('todos') }}
              >
                ✕ Limpiar
              </button>
            )}
          </div>
          
          {citasFiltradas.length === 0 ? (
            <p className="dashboard-empty">No hay citas con estos filtros.</p>
          ) : (
            <div className="citas-lista">
              {citasFiltradas.sort((a, b) => a.hora.localeCompare(b.hora)).map(cita => (
                <div key={cita.id} className="cita-card">
                  <div className="cita-hora">{cita.hora}</div>
                  <div className="cita-info">
                    <p className="cita-cliente">{cita.nombreCliente}</p>
                    <p className="cita-detalle">📞 {cita.telefono}</p>
                    <p className="cita-detalle">✂ {getNombreServicio(cita.servicioId)} · 💈 {getNombreBarbero(cita.barberoId)}</p>
                    <p className="cita-detalle">📅 {cita.fecha}</p>
                    <p className="cita-codigo">Código: {cita.codigo}</p>
                  </div>
                  <div className="cita-acciones">
                    <span className="estado-badge" style={{
                      backgroundColor: ESTADO_ESTILOS[cita.estado].bg,
                      color: ESTADO_ESTILOS[cita.estado].color,
                    }}>
                      {ESTADO_ESTILOS[cita.estado].label}
                    </span>
                    <select
                    className="estado-select"
                    value={cita.estado}
                    onChange={e => handleCambiarEstado(cita.id, e.target.value)}
                    >
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <button
                    className="btn-eliminar"
                    onClick={() => handleEliminarCita(cita.id)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
        {seccion === 'calendario' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-titulo">Calendario de Citas</h2>
          </div>
          
          <div className="calendario-container">
            {(() => {
              const citasPorFecha = {}
              citas
                .filter(c => c.estado !== 'cancelada' && c.estado !== 'completada')
                .forEach(c => {
                  if (!citasPorFecha[c.fecha]) citasPorFecha[c.fecha] = []
                  citasPorFecha[c.fecha].push(c)
                })
                
              const fechasOrdenadas = Object.keys(citasPorFecha).sort()
              
              if (fechasOrdenadas.length === 0) {
                return <p className="dashboard-empty">No hay citas próximas.</p>
              }
              
              return fechasOrdenadas.map(fecha => (
                <div key={fecha} className="calendario-dia">
                  <div className="calendario-fecha">
                    <span className="calendario-fecha-texto">
                      📅 {new Date(fecha + 'T12:00:00').toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="dashboard-badge">{citasPorFecha[fecha].length} citas</span>
                  </div>
                  <div className="citas-lista">
                    {citasPorFecha[fecha]
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map(cita => (
                        <div key={cita.id} className="cita-card">
                          <div className="cita-hora">{cita.hora}</div>
                          <div className="cita-info">
                            <p className="cita-cliente">{cita.nombreCliente}</p>
                            <p className="cita-detalle">✂ {getNombreServicio(cita.servicioId)} · 💈 {getNombreBarbero(cita.barberoId)}</p>
                            <p className="cita-detalle">📞 {cita.telefono}</p>
                          </div>
                          <div className="cita-acciones">
                            <span className="estado-badge" style={{
                              backgroundColor: ESTADO_ESTILOS[cita.estado].bg,
                              color: ESTADO_ESTILOS[cita.estado].color,
                            }}>
                              {ESTADO_ESTILOS[cita.estado].label}
                            </span>
                            <select
                              className="estado-select"
                              value={cita.estado}
                              onChange={e => handleCambiarEstado(cita.id, e.target.value)}
                            >
                              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                            <button
                              className="btn-eliminar"
                              onClick={() => handleEliminarCita(cita.id)}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
        )}

        {/* ── SECCIÓN: Por barbero ── */}
        {seccion === 'barberos' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-titulo">Citas por Barbero</h2>
            </div>
            <div className="filtro-barberos">
              <button
                className={`filtro-btn ${filtroBarbero === 'todos' ? 'activo' : ''}`}
                onClick={() => setFiltroBarbero('todos')}
              >
                Todos
              </button>
              {BARBEROS.map(b => (
                <button
                  key={b.id}
                  className={`filtro-btn ${filtroBarbero === String(b.id) ? 'activo' : ''}`}
                  onClick={() => setFiltroBarbero(String(b.id))}
                >
                  {b.nombre}
                </button>
              ))}
            </div>
            {citasFiltradas.length === 0 ? (
              <p className="dashboard-empty">No hay citas para este barbero.</p>
            ) : (
              <div className="citas-lista">
                {citasFiltradas.sort((a, b) => a.hora.localeCompare(b.hora)).map(cita => (
                  <div key={cita.id} className="cita-card">
                    <div className="cita-hora">{cita.hora}</div>
                    <div className="cita-info">
                      <p className="cita-cliente">{cita.nombreCliente}</p>
                      <p className="cita-detalle">✂ {getNombreServicio(cita.servicioId)}</p>
                      <p className="cita-detalle">📞 {cita.telefono}</p>
                      <p className="cita-detalle">📅 {cita.fecha}</p>
                    </div>
                    <div className="cita-acciones">
                      <span className="estado-badge" style={{
                        backgroundColor: ESTADO_ESTILOS[cita.estado].bg,
                        color: ESTADO_ESTILOS[cita.estado].color,
                      }}>
                        {ESTADO_ESTILOS[cita.estado].label}
                      </span>
                      <select
                        className="estado-select"
                        value={cita.estado}
                        onChange={e => handleCambiarEstado(cita.id, e.target.value)}
                      >
                        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SECCIÓN: Servicios ── */}
        {seccion === 'servicios' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-titulo">Gestionar Servicios</h2>
            </div>
            <div className="servicio-form-card">
              <p className="paso-label-seccion">Agregar nuevo servicio</p>
              <div className="servicio-form-grid">
                <input
                  className="input-field"
                  placeholder="Nombre del servicio"
                  value={nuevoServicio.nombre}
                  onChange={e => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Duración (min)"
                  type="number"
                  value={nuevoServicio.duracion}
                  onChange={e => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Precio ($)"
                  type="number"
                  value={nuevoServicio.precio}
                  onChange={e => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                />
                <button className="btn-dorado" onClick={handleAgregarServicio}>+ Agregar</button>
              </div>
            </div>
            <div className="citas-lista">
              {servicios.map(s => (
                <div key={s.id} className="cita-card">
                  {editando?.id === s.id ? (
                    <div className="servicio-edit-form">
                      <input className="input-field" value={editando.nombre} onChange={e => setEditando({ ...editando, nombre: e.target.value })} />
                      <input className="input-field" type="number" value={editando.duracion} onChange={e => setEditando({ ...editando, duracion: e.target.value })} />
                      <input className="input-field" type="number" value={editando.precio} onChange={e => setEditando({ ...editando, precio: e.target.value })} />
                      <div className="btn-group">
                        <button className="btn-dorado" onClick={handleGuardarEdicion}>Guardar</button>
                        <button className="btn-outline" onClick={() => setEditando(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="cita-info">
                        <p className="cita-cliente">{s.nombre}</p>
                        <p className="cita-detalle">⏱ {s.duracion} min &nbsp;·&nbsp; 💰 ${s.precio.toLocaleString()}</p>
                      </div>
                      <div className="cita-acciones">
                        <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setEditando(s)}>✏ Editar</button>
                        <button className="btn-eliminar" onClick={() => handleEliminarServicio(s.id)}>🗑 Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard