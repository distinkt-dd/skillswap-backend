import { Router } from 'express'
import {
	createApplication,
	deleteApplicationById,
	getAcceptedOffers,
	getReceivedApplications,
	getRejectedApplications,
	updateApplicationStatus,
} from '../controllers/application.controllers'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// POST /applications/:offerId — создание заявки на предложение
router.post('/:offerId/:offerToId/:userToId', authMiddleware, createApplication)

// GET /applications/accepted-offers — получение принятых предложений для текущего пользователя
router.get('/accepted-offers', authMiddleware, getAcceptedOffers)

// GET /applications/received-applications — получение входящих заявок для текущего пользователя
router.get('/received-applications', authMiddleware, getReceivedApplications)
router.get('/rejected-applications', authMiddleware, getRejectedApplications)
router.delete('/:appId', authMiddleware, deleteApplicationById)

// PATCH /applications/:applicationId — обновление статуса заявки (принять/отклонить)
router.patch('/:applicationId', authMiddleware, updateApplicationStatus)

export default router
