import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(__dirname, '../data/db.json')
const leerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
const guardarDB = (data: any) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

export const getCitas = (req: Request, res: Response) => {
  const db = leerDB()
  res.json(db.citas)
}

export const crearCita = (req: Request, res: Response) => {
  const { nombreCliente, telefono, servicioId, barberoId, fecha, hora } = req.body
  if (!nombreCliente || !telefono || !servicioId || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }
  const db = leerDB()
  const citaExistente = db.citas.find(
    (c: any) => c.barberoId === Number(barberoId) && c.fecha === fecha && c.hora === hora
  )
  if (citaExistente) {
    return res.status(409).json({ error: 'Ese horario ya está ocupado para este barbero' })
  }
  const nuevaCita = {
    id: Date.now(),
    nombreCliente,
    telefono,
    servicioId: Number(servicioId),
    barberoId: Number(barberoId),
    fecha,
    hora,
    estado: 'pendiente',
    codigo: `BB-${Date.now().toString().slice(-6)}`
  }
  db.citas.push(nuevaCita)
  guardarDB(db)
  res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: nuevaCita })
}

export const actualizarEstadoCita = (req: Request, res: Response) => {
  const { id } = req.params
  const { estado } = req.body
  const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada']
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' })
  }
  const db = leerDB()
  const cita = db.citas.find((c: any) => c.id === Number(id))
  if (!cita) return res.status(404).json({ error: 'Cita no encontrada' })
  cita.estado = estado
  guardarDB(db)
  res.json({ mensaje: 'Estado actualizado', cita })
}