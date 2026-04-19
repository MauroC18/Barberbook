import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const { pathname } = useLocation()

  const nav = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 40px', backgroundColor: '#111', borderBottom: '2px solid #c9a84c',
    position: 'sticky', top: 0, zIndex: 50,
  }
  const logo = { fontSize: '22px', fontWeight: 'bold', color: '#c9a84c', letterSpacing: '2px' }
  const ul = { display: 'flex', gap: '32px', listStyle: 'none' }
  const linkStyle = (path) => ({
    color: pathname === path ? '#c9a84c' : '#aaa',
    fontSize: '15px', fontWeight: pathname === path ? '700' : '400',
    borderBottom: pathname === path ? '2px solid #c9a84c' : '2px solid transparent',
    paddingBottom: '2px', transition: 'color 0.2s',
  })

  return (
    <nav style={nav}>
      <Link to="/"><span style={logo}>✂ BARBERBOOK</span></Link>
      <ul style={ul}>
        <li><Link to="/" style={linkStyle('/')}>Inicio</Link></li>
        <li><Link to="/servicios" style={linkStyle('/servicios')}>Servicios</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar