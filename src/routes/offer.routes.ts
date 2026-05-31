import { Router } from 'express'
import {
	createOffer,
	deleteOffer,
	getOfferById,
	getOffers,
	updateOffer
} from '../controllers/offer.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', getOffers)
router.get('/:id', getOfferById)
router.post('/', authMiddleware, createOffer)
router.patch('/:id', authMiddleware, updateOffer)
router.delete('/:id', authMiddleware, deleteOffer)

export default router
