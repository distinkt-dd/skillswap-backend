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
import { validate } from '../middlewares/validate.middleware'
import {
	passwordChangeSchema,
	userDataUpdateSchema,
	userLoginSchema,
	userRegisterSchema,
} from '../schemas/user.schema'

const router = Router()

router.get('/', getUsers)
router.get('/checkme', authMiddleware, checkMe)
router.get('/:id', getUserById)

router.post('/register', validate(userRegisterSchema), registerUser)
router.post('/login', validate(userLoginSchema), loginUser)

router.patch(
	'/:id',
	authMiddleware,
	validate(userDataUpdateSchema),
	updateUserData,
)
router.patch(
	'/:id/password',
	authMiddleware,
	validate(passwordChangeSchema),
	updateUserPassword,
)

router.delete('/:id', authMiddleware, deleteUser)

export default router
