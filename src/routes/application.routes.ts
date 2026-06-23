import { Router } from 'express'
import {
	createApplication,
	getAcceptedOffers,
	getReceivedApplications,
	updateApplicationStatus
} from '../controllers/application.controllers'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// POST /applications/:offerId — создание заявки на предложение
router.post('/:offerId/:userToId', authMiddleware, createApplication)

// GET /applications/accepted-offers — получение принятых предложений для текущего пользователя
router.get('/accepted-offers', authMiddleware, getAcceptedOffers)

// GET /applications/received-applications — получение входящих заявок для текущего пользователя
router.get('/received-applications', authMiddleware, getReceivedApplications)

// PATCH /applications/:applicationId — обновление статуса заявки (принять/отклонить)
router.patch('/:applicationId', authMiddleware, updateApplicationStatus)

export default router
