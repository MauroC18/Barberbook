import { prisma } from './_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const barberos = await prisma.barbero.findMany()
      return res.json(barberos)
    }

    if (req.method === 'POST') {
      const { nombre, especialidad, foto } = req.body
      if (!nombre || !especialidad) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
      }
      const nuevo = await prisma.barbero.create({
        data: { nombre, especialidad, foto: foto || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + nombre }
      })
      return res.status(201).json(nuevo)
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: 'Error del servidor' })
  }
}