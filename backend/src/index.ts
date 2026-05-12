import express from 'express'
import cors from 'cors'
import serviciosRouter from './routes/servicios'
import barberosRouter from './routes/barberos'
import citasRouter from './routes/citas'
import authRouter from './routes/auth'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/api/servicios', serviciosRouter)
app.use('/api/barberos', barberosRouter)
app.use('/api/citas', citasRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.json({ mensaje: '✂️ BarberBook API funcionando correctamente' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})