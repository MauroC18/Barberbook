import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(__dirname, '../data/db.json')
const leerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

export const getBarberos = (req: Request, res: Response) => {
  const db = leerDB()
  res.json(db.barberos)
}