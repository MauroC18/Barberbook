import { Request, Response } from 'express'
import prisma from '../prismaClient'

export const getBarberos = async (req: Request, res: Response) => {
  const barberos = await prisma.barbero.findMany()
  res.json(barberos)
}