import { Router } from 'express'
import { getBarberos } from '../controllers/barberosController'

const router = Router()

router.get('/', getBarberos)

export default router