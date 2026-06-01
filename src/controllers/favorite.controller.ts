import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

// GET /favorites
export const getFavorites = async (req: AuthRequest, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.userId },
			select: { favorites: true },
		})
		if (!user) return res.status(404).json({ error: 'Пользователь не найден!' })
		const favorites = user.favorites as string[]
		res.json(favorites)
	} catch (error) {
		res.status(500).json({ error: 'Упс! Что то не так!' })
	}
}

// PUT /favorites — полная замена массива
export const updateFavorites = async (req: AuthRequest, res: Response) => {
	try {
		const newFavorites: string[] = req.body
		const updated = await prisma.user.update({
			where: { id: req.userId },
			data: { favorites: newFavorites },
		})
		res.json(updated.favorites as string[])
	} catch (error) {
		res.status(500).json({ error: 'Упс! Что то не так!' })
	}
}
