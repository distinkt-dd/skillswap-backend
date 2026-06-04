import { Router } from 'express'
import {
	getFavorites,
	updateFavorites,
} from '../controllers/favorite.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { favoritesUpdateSchema } from '../schemas/offers.schema'

const router = Router()
router.use(authMiddleware)
router.get('/', getFavorites)
router.put('/', validate(favoritesUpdateSchema), updateFavorites)

export default router
