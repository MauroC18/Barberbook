import { Link, useLocation } from 'react-router-dom'


function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <Link to="/"><span className="navbar-logo">✂ BARBERBOOK</span></Link>
      <ul className="navbar-links">
        <li>
          <Link to="/inicio" className={`navbar-link ${pathname === '/inicio' ? 'activo' : 'inactivo'}`}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/servicios" className={`navbar-link ${pathname === '/servicios' ? 'activo' : 'inactivo'}`}>
            Servicios
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar