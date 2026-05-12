import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(__dirname, '../data/db.json')
const leerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
const guardarDB = (data: any) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

export const getServicios = (req: Request, res: Response) => {
  const db = leerDB()
  res.json(db.servicios)
}

export const crearServicio = (req: Request, res: Response) => {
  const { nombre, duracion, precio } = req.body
  if (!nombre || !duracion || !precio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }
  const db = leerDB()
  const nuevo = { id: Date.now(), nombre, duracion: Number(duracion), precio: Number(precio) }
  db.servicios.push(nuevo)
  guardarDB(db)
  res.status(201).json(nuevo)
}

export const actualizarServicio = (req: Request, res: Response) => {
  const { id } = req.params
  const { nombre, duracion, precio } = req.body
  const db = leerDB()
  const index = db.servicios.findIndex((s: any) => s.id === Number(id))
  if (index === -1) return res.status(404).json({ error: 'Servicio no encontrado' })
  db.servicios[index] = { id: Number(id), nombre, duracion: Number(duracion), precio: Number(precio) }
  guardarDB(db)
  res.json(db.servicios[index])
}

export const eliminarServicio = (req: Request, res: Response) => {
  const { id } = req.params
  const db = leerDB()
  const index = db.servicios.findIndex((s: any) => s.id === Number(id))
  if (index === -1) return res.status(404).json({ error: 'Servicio no encontrado' })
  db.servicios.splice(index, 1)
  guardarDB(db)
  res.json({ mensaje: 'Servicio eliminado correctamente' })
}