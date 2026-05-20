import { prisma } from '../../_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { codigo } = req.query

  try {
    if (req.method === 'PATCH') {
      const cita = await prisma.cita.findUnique({ where: { codigo } })

      if (!cita) return res.status(404).json({ error: 'No encontramos ninguna cita con ese código' })
      if (cita.estado === 'cancelada') return res.status(400).json({ error: 'Esta cita ya fue cancelada' })
      if (cita.estado === 'completada') return res.status(400).json({ error: 'No puedes cancelar una cita completada' })

      const citaCancelada = await prisma.cita.update({
        where: { codigo },
        data: { estado: 'cancelada' }
      })

      return res.json({ mensaje: 'Cita cancelada exitosamente', cita: citaCancelada })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: 'Error del servidor' })
  }
}