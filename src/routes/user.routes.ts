import { Router } from 'express'
import {
	checkMe,
	deleteUser,
	getUserById,
	getUsers,
	loginUser,
	registerUser,
	updateUserData,
	updateUserPassword,
} from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.get('/', getUsers)
router.get('/checkme', authMiddleware, checkMe)
router.get('/:id', getUserById)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.patch('/:id', authMiddleware, updateUserData)
router.patch('/:id/password', authMiddleware, updateUserPassword)
router.delete('/:id', authMiddleware, deleteUser)

export default router
