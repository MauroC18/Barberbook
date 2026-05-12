import { Router } from 'express'
import { getCitas, crearCita, actualizarEstadoCita } from '../controllers/citasController'

const router = Router()

router.get('/', getCitas)
router.post('/', crearCita)
router.patch('/:id', actualizarEstadoCita)

export default router