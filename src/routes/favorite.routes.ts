import { Router } from 'express'
import {
	getFavorites,
	updateFavorites
} from '../controllers/favorite.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.use(authMiddleware) // все эндпоинты требуют аутентификации
router.get('/', getFavorites)
router.put('/', updateFavorites)

export default router
