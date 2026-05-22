import { prisma } from './_lib/prisma.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const servicios = await prisma.servicio.findMany()
      return res.json(servicios)
    }


    if (req.method === 'POST') {
      const { nombre, duracion, precio, emoji } = req.body
      if (!nombre || !duracion || !precio) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
      }
      const nuevo = await prisma.servicio.create({
        data: { nombre, duracion: Number(duracion), precio: Number(precio), emoji: emoji || '✂️'}
      })
      return res.status(201).json(nuevo)
    }

    
    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: 'Error del servidor' })
  }
}