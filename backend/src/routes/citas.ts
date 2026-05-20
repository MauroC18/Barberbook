import { Router } from 'express'
import { getCitas, crearCita, actualizarEstadoCita, getDisponibilidad } from '../controllers/citasController'

const router = Router()

router.get('/disponibilidad', getDisponibilidad)
router.get('/', getCitas)
router.post('/', crearCita)
router.patch('/:id', actualizarEstadoCita)

export default router