import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../services/api'

function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(null)
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    if (!usuario || !contrasena) {
      setError('Por favor completa todos los campos')
      return
    }
    setCargando(true)
    const resultado = await loginAdmin(usuario, contrasena)
    setCargando(false)
    if (resultado.error) {
      setError(resultado.error)
      return
    }
    localStorage.setItem('adminSession', 'true')
    navigate('/admin/dashboard')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="login-pagina-nueva">

      <div className="login-fondo-decorativo">
        <div className="login-burbuja login-burbuja-1" />
        <div className="login-burbuja login-burbuja-2" />
        <div className="login-burbuja login-burbuja-3" />
      </div>

      <div className="login-contenido">

        <div className="login-encabezado">
          <div className="login-icono-nuevo">✂</div>
          <h1 className="login-titulo-nuevo">BARBERBOOK</h1>
          <p className="login-descripcion">¿Cómo deseas continuar?</p>
        </div>

        {/* Cards de selección */}
        {!tab && (
          <div className="login-cards">
            <div className="login-card-opcion" onClick={() => navigate('/servicios')}>
              <div className="login-card-icono">💈</div>
              <h3 className="login-card-titulo">Soy Cliente</h3>
              <p className="login-card-texto">
                Agenda tu cita con tu barbero favorito
              </p>
              <div className="login-card-btn-dorado">Agendar Cita →</div>
            </div>

            <div className="login-card-opcion" onClick={() => setTab('admin')}>
              <div className="login-card-icono">🔐</div>
              <h3 className="login-card-titulo">Administrador</h3>
              <p className="login-card-texto">
                Gestiona citas y servicios de la barbería
              </p>
              <div className="login-card-btn-outline">Ingresar →</div>
            </div>
          </div>
        )}

        {/* Formulario Admin */}
        {tab === 'admin' && (
          <div className="login-form-admin">
            <button
              className="login-volver"
              onClick={() => { setTab(null); setError(''); setUsuario(''); setContrasena('') }}
            >
              ← Volver
            </button>

            <h2 className="login-form-titulo">Panel de Administración</h2>
            <p className="login-form-subtitulo">Ingresa tus credenciales para continuar</p>

            <div className="login-input-grupo">
              <label className="login-input-label">Usuario</label>
              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={e => { setUsuario(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                className="login-input-nuevo"
              />
            </div>

            <div className="login-input-grupo">
              <label className="login-input-label">Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={e => { setContrasena(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                className="login-input-nuevo"
              />
            </div>

            {error && <p className="login-error">⚠️ {error}</p>}

            <button
              className={`btn-dorado ${cargando ? 'deshabilitado' : ''}`}
              style={{ width: '100%', marginTop: '24px' }}
              onClick={handleLogin}
              disabled={cargando}
            >
              {cargando ? '⏳ Verificando...' : 'Ingresar al Panel →'}
            </button>
          </div>
        )}

        <p className="login-footer">BarberBook © 2025 — Sistema de Gestión de Citas</p>

      </div>
    </div>
  )
}

export default Login