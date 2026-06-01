import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt.util'

export interface AuthRequest extends Request {
	userId?: string
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ message: 'Пользователь не авторизован!' })
		return
	}
	const token = authHeader.split(' ')[1]
	try {
		const decoded = verifyToken(token)
		req.userId = decoded.userId
		next()
	} catch (error) {
		res.status(401).json({ message: 'Пользователь не авторизован!' })
	}
}
