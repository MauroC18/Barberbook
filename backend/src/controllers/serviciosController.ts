import { Request, Response } from 'express'
import prisma from '../prismaClient'

export const getServicios = async (req: Request, res: Response) => {
  const servicios = await prisma.servicio.findMany()
  res.json(servicios)
}

export const crearServicio = async (req: Request, res: Response) => {
  const { nombre, duracion, precio } = req.body
  if (!nombre || !duracion || !precio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }
  const nuevo = await prisma.servicio.create({
    data: { nombre, duracion: Number(duracion), precio: Number(precio) }
  })
  res.status(201).json(nuevo)
}

export const actualizarServicio = async (req: Request, res: Response) => {
  const { id } = req.params
  const { nombre, duracion, precio } = req.body
  const actualizado = await prisma.servicio.update({
    where: { id: Number(id) },
    data: { nombre, duracion: Number(duracion), precio: Number(precio) }
  })
  res.json(actualizado)
}

export const eliminarServicio = async (req: Request, res: Response) => {
  const { id } = req.params
  await prisma.servicio.delete({ where: { id: Number(id) } })
  res.json({ mensaje: 'Servicio eliminado correctamente' })
}