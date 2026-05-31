import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'
import { TOffer, TOfferCreate } from '../types'
import { cleanStringArray } from '../utils/clean-array'

export const getOffers = async (req: Request, res: Response) => {
	try {
		const offers = await prisma.offer.findMany()
		// Преобразуем JSON поля в массивы
		const formatted = offers.map(offer => ({
			...offer,
			images: offer.images as string[],
			userLikedIds: offer.userLikedIds as string[]
		}))
		res.json(formatted as TOffer[])
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch offers' })
	}
}

export const getOfferById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const offerId = Array.isArray(id) ? id[0] : id
		const offer = await prisma.offer.findUnique({ where: { id: offerId } })
		if (!offer) return res.status(404).json({ error: 'Offer not found' })
		res.json({
			...offer,
			images: offer.images as string[],
			userLikedIds: offer.userLikedIds as string[]
		} as TOffer)
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch offer' })
	}
}

export const createOffer = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.userId // из токена
		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const data: TOfferCreate = req.body

		// Проверяем, существует ли пользователь
		const user = await prisma.user.findUnique({ where: { id: userId } })
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Проверяем, существует ли подкатегория
		const subcategory = await prisma.subcategory.findUnique({
			where: { id: data.subcategoryId }
		})
		if (!subcategory) {
			return res.status(400).json({ error: 'Invalid subcategoryId' })
		}

		const newOffer = await prisma.offer.create({
			data: {
				userId,
				name: data.name,
				subcategoryId: data.subcategoryId,
				description: data.description,
				images: cleanStringArray(data.images),
				userLikedIds: [],
				createdAt: new Date().toISOString()
			}
		})

		res.status(201).json({
			...newOffer,
			images: newOffer.images as string[],
			userLikedIds: newOffer.userLikedIds as string[]
		})
	} catch (error) {
		console.error('Create offer error:', error)
		res.status(500).json({ error: 'Failed to create offer' })
	}
}

export const updateOffer = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params
		const offerId = Array.isArray(id) ? id[0] : id
		const data = req.body
		const existing = await prisma.offer.findUnique({ where: { id: offerId } })
		if (!existing) return res.status(404).json({ error: 'Offer not found' })
		const updated = await prisma.offer.update({
			where: { id: offerId },
			data: {
				name: data.name,
				subcategoryId: data.subcategoryId,
				description: data.description,
				images: data.images,
				userLikedIds: data.userLikedIds,
				updatedAt: new Date().toISOString()
			}
		})
		res.json({
			...updated,
			images: updated.images as string[],
			userLikedIds: updated.userLikedIds as string[]
		})
	} catch (error) {
		res.status(500).json({ error: 'Failed to update offer' })
	}
}

export const deleteOffer = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params
		const offerId = Array.isArray(id) ? id[0] : id
		const existing = await prisma.offer.findUnique({ where: { id: offerId } })
		if (!existing) return res.status(404).json({ error: 'Offer not found' })
		if (existing.userId !== req.userId) {
			return res.status(403).json({ error: 'Forbidden' })
		}
		await prisma.offer.delete({ where: { id: offerId } })
		res.status(204).send()
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete offer' })
	}
}
