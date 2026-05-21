import { prisma } from '../_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    if (req.method === 'PATCH') {
      const { estado } = req.body
      const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada']
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido' })
      }
      const cita = await prisma.cita.update({
        where: { id: Number(id) },
        data: { estado }
      })
      return res.json({ mensaje: 'Estado actualizado', cita })
    }

    if (req.method === 'DELETE') {
      await prisma.cita.delete({
        where: { id: Number(id) }
      })
      return res.json({ mensaje: 'Cita eliminada correctamente' })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}