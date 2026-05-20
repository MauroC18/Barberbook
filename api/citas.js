import { prisma } from './_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const citas = await prisma.cita.findMany({
        include: { barbero: true, servicio: true }
      })
      return res.json(citas)
    }

    if (req.method === 'POST') {
      const { nombreCliente, telefono, servicioId, barberoId, fecha, hora } = req.body

      if (!nombreCliente || !telefono || !servicioId || !fecha || !hora) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
      }

      const citaExistente = await prisma.cita.findFirst({
        where: {
          barberoId: Number(barberoId),
          fecha,
          hora,
          estado: { not: 'cancelada' }
        }
      })

      if (citaExistente) {
        return res.status(409).json({ error: 'Ese horario ya está ocupado' })
      }

      const nuevaCita = await prisma.cita.create({
        data: {
          nombreCliente,
          telefono,
          servicioId: Number(servicioId),
          barberoId: Number(barberoId),
          fecha,
          hora,
          estado: 'pendiente',
          codigo: `BB-${Date.now().toString().slice(-6)}`
        }
      })

      return res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: nuevaCita })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: 'Error del servidor' })
  }
}