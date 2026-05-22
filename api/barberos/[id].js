import { prisma } from '../_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    if (req.method === 'DELETE') {
      await prisma.barbero.delete({ where: { id: Number(id) } })
      return res.json({ mensaje: 'Barbero eliminado correctamente' })
    }

    if (req.method === 'PUT') {
      const { nombre, especialidad, foto } = req.body
      const actualizado = await prisma.barbero.update({
        where: { id: Number(id) },
        data: { nombre, especialidad, foto }
      })
      return res.json(actualizado)
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: 'Error del servidor' })
  }
}