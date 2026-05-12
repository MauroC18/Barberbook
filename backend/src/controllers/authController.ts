import { Request, Response } from 'express'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'barberbook123'

export const login = (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  if (usuario === ADMIN_USER && contrasena === ADMIN_PASS) {
    return res.json({ 
      mensaje: 'Login exitoso',
      token: 'barberbook-admin-token'
    })
  }

  return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
}