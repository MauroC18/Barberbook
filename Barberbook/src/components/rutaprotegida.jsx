import { Navigate } from 'react-router-dom'

function RutaProtegida({ children }) {
  const sesionActiva = localStorage.getItem('adminSession') === 'true'

  if (!sesionActiva) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RutaProtegida