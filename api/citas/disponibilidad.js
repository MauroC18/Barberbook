import { prisma } from '../_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { barberoId, fecha } = req.query

  if (!barberoId || !fecha) {
    return res.status(400).json({ error: 'Faltan parámetros' })
  }

  const todosLosHorarios = []
  for (let h = 9; h < 20; h++) {
    todosLosHorarios.push(`${String(h).padStart(2, '0')}:00`)
    todosLosHorarios.push(`${String(h).padStart(2, '0')}:30`)
  }
  const horariosFiltrados = todosLosHorarios.filter(h => h <= '19:30')

  const citasOcupadas = await prisma.cita.findMany({
    where: {
      barberoId: Number(barberoId),
      fecha: String(fecha),
      estado: { not: 'cancelada' }
    }
  })

  const horasOcupadas = citasOcupadas.map(c => c.hora)
  const horasDisponibles = horariosFiltrados.filter(h => !horasOcupadas.includes(h))

  return res.json({ horasDisponibles, horasOcupadas })
}