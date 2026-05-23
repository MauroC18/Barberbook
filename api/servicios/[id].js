import { prisma } from '../_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    if (req.method === 'PUT') {
      const { nombre, duracion, precio, emoji } = req.body
      const actualizado = await prisma.servicio.update({
        where: { id: Number(id) },
        data: {
          nombre,
          duracion: Number(duracion),
          precio: Number(precio),
          emoji: emoji || '✂️'
        }
      })
      return res.json(actualizado)
    }

    if (req.method === 'DELETE') {
      const citasAsociadas = await prisma.cita.count({
        where: { servicioId: Number(id) }
      })

      if (citasAsociadas > 0) {
        return res.status(400).json({
          error: `No se puede eliminar este servicio porque tiene ${citasAsociadas} cita(s) asociada(s). Elimina primero las citas.`
        })
      }

      await prisma.servicio.delete({ where: { id: Number(id) } })
      return res.json({ mensaje: 'Servicio eliminado correctamente' })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error del servidor', detalle: error.message })
  }
}