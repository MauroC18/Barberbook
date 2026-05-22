import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCitas, actualizarEstadoCita, getServicios, crearServicio, actualizarServicio, eliminarServicio, eliminarCita, getBarberos, crearBarbero, eliminarBarbero, actualizarBarbero } from '../../services/api'


const ESTADOS = ['pendiente', 'confirmada', 'completada', 'cancelada']

const ESTADO_ESTILOS = {
  pendiente: { bg: '#c9a84c22', color: '#c9a84c', label: '⏳ Pendiente' },
  confirmada: { bg: '#22c95522', color: '#22c955', label: '✅ Confirmada' },
  completada: { bg: '#2e75b622', color: '#2e75b6', label: '🏁 Completada' },
  cancelada: { bg: '#ff444422', color: '#ff4444', label: '❌ Cancelada' },
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// ── COMPONENTE PRINCIPAL ──
function Dashboard() {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('citas')
  const [filtroBarbero, setFiltroBarbero] = useState('todos')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [citas, setCitas] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', duracion: '', precio: '', emoji: '✂️' })
  const [editando, setEditando] = useState(null)
  const [barberos, setBarberos] = useState([])
  const [nuevoBarbero, setNuevoBarbero] = useState({ nombre: '', especialidad: '', foto: '' })
  const [editandoBarbero, setEditandoBarbero] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const [citasData, serviciosData, barberosData] = await Promise.all([
      getCitas(),
      getServicios(),
      getBarberos()
    ])
    setCitas(citasData) 
    setServicios(serviciosData)
    setBarberos(barberosData)
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

  const handleEliminarCita = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return
    await eliminarCita(id)
    setCitas(prev => prev.filter(c => c.id !== id))
  }

  const getNombreBarbero = (id) => barberos.find(b => b.id === id)?.nombre || 'N/A'
  const getNombreServicio = (id) => servicios.find(s => s.id === id)?.nombre || 'N/A'

  // Fechas y lógica para la sección de "Citas del día"
  const ahora = new Date()
  const fechaHoy = ahora.toISOString().split('T')[0]
  const horaAhora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`

  const citasActivas = citas.filter(c => {
    if (c.estado === 'cancelada') return false
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

  const handleAgregarBarbero = async () => {
    if (!nuevoBarbero.nombre || !nuevoBarbero.especialidad) return
    const creado = await crearBarbero(nuevoBarbero)
    setBarberos(prev => [...prev, creado])
    setNuevoBarbero({ nombre: '', especialidad: '', foto: '' })
  }

  const handleEliminarBarbero = async (id) => {
    if (!window.confirm('¿Eliminar este barbero?')) return
    await eliminarBarbero(id)
    setBarberos(prev => prev.filter(b => b.id !== id))
  }

  const handleGuardarEdicionBarbero = async () => {
    const actualizado = await actualizarBarbero(editandoBarbero.id, editandoBarbero)
    setBarberos(prev => prev.map(b => b.id === editandoBarbero.id ? actualizado : b))
    setEditandoBarbero(null)
  }

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
            { id: 'barberos-admin', label: '💈 Barberos' },
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

        {/* ── SECCIÓN: Calendario ── */}
        {seccion === 'calendario' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-titulo">Calendario de Citas</h2>
            </div>
            <div className="calendario-container">
              <CalendarioCitas
                citas={citas}
                getNombreBarbero={getNombreBarbero}
                getNombreServicio={getNombreServicio}
                handleCambiarEstado={handleCambiarEstado}
                handleEliminarCita={handleEliminarCita}
                ESTADO_ESTILOS={ESTADO_ESTILOS}
                ESTADOS={ESTADOS}
              />
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="login-input-label">Nombre</label>
                  <input
                    className="input-field"
                    placeholder="Nombre del servicio"
                    value={nuevoServicio.nombre}
                    onChange={e => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="login-input-label">Duración (min)</label>
                  <input
                    className="input-field"
                    placeholder="30"
                    type="number"
                    value={nuevoServicio.duracion}
                    onChange={e => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="login-input-label">Precio ($)</label>
                  <input
                    className="input-field"
                    placeholder="15000"
                    type="number"
                    value={nuevoServicio.precio}
                    onChange={e => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="login-input-label">Emoji</label>
                  <input
                    className="input-field"
                    placeholder="✂️"
                    value={nuevoServicio.emoji}
                    onChange={e => setNuevoServicio({ ...nuevoServicio, emoji: e.target.value })}
                    style={{ fontSize: '20px', textAlign: 'center' }}
                  />
                </div>
                <button className="btn-dorado" onClick={handleAgregarServicio} style={{ alignSelf: 'flex-end' }}>
                  + Agregar
                </button>
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
                        <p className="cita-detalle">⏱ {s.duracion} min &nbsp;·&nbsp; 💰 ${Number(s.precio).toLocaleString()}</p>
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

        {seccion === 'barberos-admin' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-titulo">Gestionar Barberos</h2>
            </div>

            {/* Formulario agregar */}
            <div className="servicio-form-card">
              <p className="paso-label-seccion">Agregar nuevo barbero</p>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label className="login-input-label">Nombre</label>
                  <input
                    className="input-field"
                    placeholder="Nombre del barbero"
                    value={nuevoBarbero.nombre}
                    onChange={e => setNuevoBarbero({ ...nuevoBarbero, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="login-input-label">Especialidad</label>
                  <input
                    className="input-field"
                    placeholder="Ej: Cortes clásicos"
                    value={nuevoBarbero.especialidad}
                    onChange={e => setNuevoBarbero({ ...nuevoBarbero, especialidad: e.target.value })}
                  />
                </div>
                <div>
                  <label className="login-input-label">URL Foto (opcional)</label>
                  <input
                    className="input-field"
                    placeholder="https://..."
                    value={nuevoBarbero.foto}
                    onChange={e => setNuevoBarbero({ ...nuevoBarbero, foto: e.target.value })}
                  />
                </div>
                <button className="btn-dorado" onClick={handleAgregarBarbero}>
                  + Agregar
                </button>
              </div>
            </div>

            {/* Lista de barberos */}
            <div className="citas-lista">
              {barberos.map(b => (
                <div key={b.id} className="cita-card">
                  {editandoBarbero?.id === b.id ? (
                    <div className="servicio-edit-form">
                      <input
                        className="input-field"
                        value={editandoBarbero.nombre}
                        onChange={e => setEditandoBarbero({ ...editandoBarbero, nombre: e.target.value })}
                        placeholder="Nombre"
                      />
                      <input
                        className="input-field"
                        value={editandoBarbero.especialidad}
                        onChange={e => setEditandoBarbero({ ...editandoBarbero, especialidad: e.target.value })}
                        placeholder="Especialidad"
                      />
                      <input
                        className="input-field"
                        value={editandoBarbero.foto}
                        onChange={e => setEditandoBarbero({ ...editandoBarbero, foto: e.target.value })}
                        placeholder="URL foto"
                      />
                      <div className="btn-group">
                        <button className="btn-dorado" onClick={handleGuardarEdicionBarbero}>Guardar</button>
                        <button className="btn-outline" onClick={() => setEditandoBarbero(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={b.foto || `https://api.dicebear.com/7.x/adventurer/svg?seed=${b.nombre}`}
                        alt={b.nombre}
                        className="barbero-foto"
                        style={{ width: '56px', height: '56px' }}
                      />
                      <div className="cita-info">
                        <p className="cita-cliente">{b.nombre}</p>
                        <p className="cita-detalle">✂ {b.especialidad}</p>
                      </div>
                      <div className="cita-acciones">
                        <button
                          className="btn-outline"
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                          onClick={() => setEditandoBarbero(b)}
                        >
                          ✏ Editar
                        </button>
                        <button className="btn-eliminar" onClick={() => handleEliminarBarbero(b.id)}>
                          🗑 Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

// CALENDARIO DE CITAS
function CalendarioCitas({ citas, getNombreBarbero, getNombreServicio, handleCambiarEstado, handleEliminarCita, ESTADO_ESTILOS, ESTADOS }) {
  const hoy = new Date()
  const [mesActual, setMesActual] = useState(hoy.getMonth())
  const [anioActual, setAnioActual] = useState(hoy.getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  const primerDia = new Date(anioActual, mesActual, 1).getDay()
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate()

  const citasDelMes = citas.filter(c => {
    if (c.estado === 'cancelada') return false
    const [anio, mes] = c.fecha.split('-').map(Number)
    return anio === anioActual && mes === mesActual + 1
  })

  const citasPorDia = {}
  citasDelMes.forEach(c => {
    const dia = parseInt(c.fecha.split('-')[2])
    if (!citasPorDia[dia]) citasPorDia[dia] = []
    citasPorDia[dia].push(c)
  })

  const citasDiaSeleccionado = diaSeleccionado ? (citasPorDia[diaSeleccionado] || []) : []

  const mesAnterior = () => {
    if (mesActual === 0) { setMesActual(11); setAnioActual(a => a - 1) }
    else setMesActual(m => m - 1)
    setDiaSeleccionado(null)
  }

  const mesSiguiente = () => {
    if (mesActual === 11) { setMesActual(0); setAnioActual(a => a + 1) }
    else setMesActual(m => m + 1)
    setDiaSeleccionado(null)
  }

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  return (
    <div>
      {/* Navegación */}
      <div className="calendario-nav">
        <button className="btn-outline" style={{ padding: '8px 16px' }} onClick={mesAnterior}>
          ← Anterior
        </button>
        <h3 className="calendario-mes-titulo">
          {MESES[mesActual]} {anioActual}
        </h3>
        <button className="btn-outline" style={{ padding: '8px 16px' }} onClick={mesSiguiente}>
          Siguiente →
        </button>
      </div>

      {/* Grid */}
      <div className="calendario-grid">
        {DIAS_SEMANA.map(d => (
          <div key={d} className="calendario-dia-nombre">{d}</div>
        ))}
        {celdas.map((dia, i) => {
          if (!dia) return <div key={`v-${i}`} className="calendario-celda-vacia" />
          const esDomingo = (i % 7 === 0)
          const esHoy = dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear()
          const tieneCitas = citasPorDia[dia]?.length > 0
          const seleccionado = diaSeleccionado === dia
          let clases = 'calendario-celda'
          if (esDomingo) clases += ' domingo'
          if (esHoy) clases += ' hoy'
          if (seleccionado) clases += ' seleccionado'
          return (
            <div
              key={dia}
              className={clases}
              onClick={() => !esDomingo && setDiaSeleccionado(seleccionado ? null : dia)}
            >
              {esHoy && <div className="calendario-celda-hoy-label" />}
              <div className="calendario-celda-numero">{dia}</div>
              {tieneCitas && (
                <div className="calendario-puntos">
                  {citasPorDia[dia].slice(0, 4).map((c, idx) => (
                    <div
                      key={idx}
                      className="calendario-punto"
                      style={{ backgroundColor: ESTADO_ESTILOS[c.estado]?.color || 'var(--gold)' }}
                    />
                  ))}
                  {citasPorDia[dia].length > 4 && (
                    <span className="calendario-mas">+{citasPorDia[dia].length - 4}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Citas del día seleccionado */}
      {diaSeleccionado && (
        <div className="calendario-citas-dia">
          <h3 className="calendario-citas-titulo">
            📅 {diaSeleccionado} de {MESES[mesActual]} — {anioActual}
            <span className="dashboard-badge">{citasDiaSeleccionado.length} citas</span>          </h3>
          {citasDiaSeleccionado.length === 0 ? (
            <p className="dashboard-empty">No hay citas para este día.</p>
          ) : (
            <div className="citas-lista">
              {citasDiaSeleccionado.sort((a, b) => a.hora.localeCompare(b.hora)).map(cita => (
                <div key={cita.id} className="cita-card">
                  <div className="cita-hora">{cita.hora}</div>
                  <div className="cita-info">
                    <p className="cita-cliente">{cita.nombreCliente}</p>
                    <p className="cita-detalle">✂ {getNombreServicio(cita.servicioId)} · 💈 {getNombreBarbero(cita.barberoId)}</p>
                    <p className="cita-detalle">📞 {cita.telefono}</p>
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
                    <button className="btn-eliminar" onClick={() => handleEliminarCita(cita.id)}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard