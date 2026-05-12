import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../services/api'

function Login() {
  const navigate = useNavigate()
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
    <div className="login-pagina">
      <div className="login-card">

        <div className="login-header">
          <span className="login-icono">✂</span>
          <h1 className="login-titulo">BarberBook</h1>
          <p className="login-subtitulo">Panel de Administración</p>
        </div>

        <div className="form-group">
          <label className="login-label">Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={e => { setUsuario(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            className="input-field"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="login-label">Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={e => { setContrasena(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            className="input-field"
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          className={`btn-dorado ${cargando ? 'deshabilitado' : ''}`}
          style={{ width: '100%', marginTop: '24px' }}
          onClick={handleLogin}
          disabled={cargando}
        >
          {cargando ? 'Verificando...' : 'Ingresar al Panel'}
        </button>

      </div>
    </div>
  )
}

export default Login