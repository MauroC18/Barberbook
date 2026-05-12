import { Router } from 'express'
import { getServicios, crearServicio, actualizarServicio, eliminarServicio } from '../controllers/serviciosController'

const router = Router()

router.get('/', getServicios)
router.post('/', crearServicio)
router.put('/:id', actualizarServicio)
router.delete('/:id', eliminarServicio)

export default router