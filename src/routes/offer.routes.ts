import { Router } from 'express'
import {
	createOffer,
	deleteOffer,
	getOfferById,
	getOffers,
	updateOffer,
} from '../controllers/offer.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import {
	createOfferSchema,
	offerDataUpdateSchema,
} from '../schemas/offers.schema'

const router = Router()

router.get('/', getOffers)
router.get('/:id', getOfferById)
router.post('/', authMiddleware, validate(createOfferSchema), createOffer)
router.patch(
	'/:id',
	authMiddleware,
	validate(offerDataUpdateSchema),
	updateOffer,
)
router.delete('/:id', authMiddleware, deleteOffer)

export default router
