import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const createApplication = async (req: AuthRequest, res: Response) => {
	const userId = req.userId // ID текущего пользователя (отправитель)
	const { offer_id } = req.params

	if (!userId) {
		return res.status(401).json({ message: 'Вы должны быть авторизованы' })
	}

	const offerId = Array.isArray(offer_id) ? offer_id[0] : offer_id

	const offer = await prisma.offer.findUnique({
		where: { id: offerId },
	})

	if (!offer) {
		return res.status(404).json({ message: 'Предложение не найдено!' })
	}

	const userToId = offer.userId

	if (userId === userToId) {
		return res.status(400).json({
			message: 'Вы не можете отправить заявку на собственное предложение',
		})
	}

	// Проверяем, нет ли уже существующей активной заявки на этот оффер от этого пользователя
	const existingApp = await prisma.application.findFirst({
		where: {
			userFromId: userId,
			offerId,
			status: 'PENDING',
		},
	})

	if (existingApp) {
		return res
			.status(400)
			.json({ message: 'Заявка уже отправлена и ожидает ответа' })
	}

	const application = await prisma.application.create({
		data: {
			userFromId: userId,
			userToId: userToId,
			offerId: offerId,
			status: 'PENDING',
		},
	})

	return res.status(201).json(application)
}

export const getAcceptedOffers = async (req: AuthRequest, res: Response) => {
	const userId = req.userId

	if (!userId) {
		return res.status(401).json({ message: 'Вы должны быть авторизованы' })
	}

	const applications = await prisma.application.findMany({
		where: {
			status: 'ACCEPTED',
			OR: [{ userFromId: userId }, { userToId: userId }],
		},
		select: {
			offer: true,
		},
	})

	const offers = applications.map(app => app.offer)
	return res.json(offers)
}

export const getReceivedApplications = async (
	req: AuthRequest,
	res: Response,
) => {
	const userId = req.userId

	const applications = await prisma.application.findMany({
		where: {
			userToId: userId,
			status: 'PENDING',
		},
		include: {
			userFrom: { select: { name: true, avatar: true } },
			offer: { select: { name: true } },
		},
		orderBy: { createdAt: 'desc' },
	})

	return res.json(applications)
}

export const updateApplicationStatus = async (
	req: AuthRequest,
	res: Response,
) => {
	const userId = req.userId
	const { applicationId } = req.params

	const application_id = Array.isArray(applicationId)
		? applicationId[0]
		: applicationId
	const { status } = req.body // 'ACCEPTED' или 'REJECTED'

	if (!['ACCEPTED', 'REJECTED'].includes(status)) {
		return res.status(400).json({ message: 'Неверный статус' })
	}

	const application = await prisma.application.findUnique({
		where: { id: application_id },
	})

	if (!application) {
		return res.status(404).json({ message: 'Заявка не найдена' })
	}

	// Важно: только получатель заявки может её принять или отклонить
	if (application.userToId !== userId) {
		return res
			.status(403)
			.json({ message: 'У вас нет прав для изменения этой заявки' })
	}

	const updatedApp = await prisma.application.update({
		where: { id: application_id },
		data: { status: status as any },
	})

	return res.json(updatedApp)
}
