const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ── SERVICIOS ──────────────────────────────
export const getServicios = async () => {
  const res = await fetch(`${BASE_URL}/servicios`)
  return res.json()
}

export const crearServicio = async (servicio) => {
  const res = await fetch(`${BASE_URL}/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servicio)
  })
  return res.json()
}

export const actualizarServicio = async (id, servicio) => {
  const res = await fetch(`${BASE_URL}/servicios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servicio)
  })
  return res.json()
}

export const eliminarServicio = async (id) => {
  const res = await fetch(`${BASE_URL}/servicios/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

// ── BARBEROS ───────────────────────────────
export const getBarberos = async () => {
  const res = await fetch(`${BASE_URL}/barberos`)
  return res.json()
}

// ── CITAS ──────────────────────────────────
export const getCitas = async () => {
  const res = await fetch(`${BASE_URL}/citas`)
  return res.json()
}

export const crearCita = async (cita) => {
  const res = await fetch(`${BASE_URL}/citas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cita)
  })
  return res.json()
}

export const actualizarEstadoCita = async (id, estado) => {
  const res = await fetch(`${BASE_URL}/citas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  })
  return res.json()
}

export const getDisponibilidad = async (barberoId, fecha) => {
  const res = await fetch(`${BASE_URL}/citas/disponibilidad?barberoId=${barberoId}&fecha=${fecha}`)
  return res.json()
}

export const cancelarCita = async (codigo) => {
  const res = await fetch(`${BASE_URL}/citas/cancelar/${codigo}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}

// ── AUTH ───────────────────────────────────
export const loginAdmin = async (usuario, contrasena) => {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, contrasena })
  })
  return res.json()
}