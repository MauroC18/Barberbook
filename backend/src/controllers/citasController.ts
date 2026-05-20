import { Request, Response } from 'express'
import prisma from '../prismaClient'

export const getCitas = async (req: Request, res: Response) => {
  const citas = await prisma.cita.findMany({
    include: {
      barbero: true,
      servicio: true
    }
  })
  res.json(citas)
}

export const crearCita = async (req: Request, res: Response) => {
  const { nombreCliente, telefono, servicioId, barberoId, fecha, hora } = req.body

  if (!nombreCliente || !telefono || !servicioId || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  // Verificar disponibilidad
  const citaExistente = await prisma.cita.findFirst({
    where: {
      barberoId: Number(barberoId),
      fecha,
      hora,
      estado: { not: 'cancelada' }
    }
  })

  if (citaExistente) {
    return res.status(409).json({ error: 'Ese horario ya está ocupado para este barbero' })
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

  res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: nuevaCita })
}

export const actualizarEstadoCita = async (req: Request, res: Response) => {
  const { id } = req.params
  const { estado } = req.body

  const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada']
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' })
  }

  const cita = await prisma.cita.update({
    where: { id: Number(id) },
    data: { estado }
  })

  res.json({ mensaje: 'Estado actualizado', cita })
}

export const getDisponibilidad = async (req: Request, res: Response) => {
  const { barberoId, fecha } = req.query

  if (!barberoId || !fecha) {
    return res.status(400).json({ error: 'Faltan parámetros barberoId y fecha' })
  }

  const todosLosHorarios = []
  for (let h = 9; h < 20; h++) {
    todosLosHorarios.push(`${String(h).padStart(2, '0')}:00`)
    todosLosHorarios.push(`${String(h).padStart(2, '0')}:30`)
  }
  const horariosFiltrados = todosLosHorarios.filter(h => h <= '19:30')

  const citasOcupadas = await prisma.cita.findMany({
    where: {
      barberoId: Number(barberoId),
      fecha: String(fecha),
      estado: { not: 'cancelada' }
    }
  })

  const horasOcupadas = citasOcupadas.map(c => c.hora)
  const horasDisponibles = horariosFiltrados.filter(h => !horasOcupadas.includes(h))

  res.json({ horasDisponibles, horasOcupadas })
}