import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const createApplication = async (req: AuthRequest, res: Response) => {
	const userId = req.userId
	const { offerId, userToId } = req.params

	if (!userId) {
		return res.status(401).json({ message: 'Вы должны быть авторизованы' })
	}

	// Приводим к строке
	const offerIdStr = Array.isArray(offerId) ? offerId[0] : offerId

	const userToIdStr = Array.isArray(userToId) ? userToId[0] : userToId

	const offer = await prisma.offer.findUnique({
		where: { id: offerIdStr } // теперь точно строка
	})

	if (!offer) {
		return res.status(404).json({ message: 'Предложение не найдено!' })
	}

	if (userId === userToIdStr) {
		return res.status(400).json({
			message: 'Вы не можете отправить заявку на собственное предложение'
		})
	}

	const existingApp = await prisma.application.findFirst({
		where: {
			userFromId: userId,
			offerId: offerIdStr,
			status: 'PENDING'
		}
	})

	if (existingApp) {
		return res
			.status(400)
			.json({ message: 'Заявка уже отправлена и ожидает ответа' })
	}

	const application = await prisma.application.create({
		data: {
			userFromId: userId,
			userToId: userToIdStr,
			offerId: offerIdStr,
			status: 'PENDING'
		}
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
			OR: [
				{
					userFromId: userId,
					OR: [{ status: 'ACCEPTED' }, { status: 'REJECTED' }]
				},
				{
					userToId: userId,
					OR: [{ status: 'ACCEPTED' }, { status: 'REJECTED' }]
				}
			]
		},
		select: {
			offer: true
		}
	})

	return res.json(applications)
}

export const getReceivedApplications = async (
	req: AuthRequest,
	res: Response
) => {
	const userId = req.userId

	const applications = await prisma.application.findMany({
		where: {
			userToId: userId,
			status: 'PENDING'
		},
		include: {
			userFrom: { select: { name: true, avatar: true } },
			offer: true
		},
		orderBy: { createdAt: 'desc' }
	})

	return res.json(applications)
}

export const updateApplicationStatus = async (
	req: AuthRequest,
	res: Response
) => {
	const userId = req.userId
	const { applicationId } = req.params
	const { status } = req.body

	const applicationIdStr = Array.isArray(applicationId)
		? applicationId[0]
		: applicationId

	if (!['ACCEPTED', 'REJECTED'].includes(status)) {
		return res.status(400).json({ message: 'Неверный статус' })
	}

	const application = await prisma.application.findUnique({
		where: { id: applicationIdStr }
	})

	if (!application) {
		return res.status(404).json({ message: 'Заявка не найдена' })
	}

	if (application.userToId !== userId) {
		return res
			.status(403)
			.json({ message: 'У вас нет прав для изменения этой заявки' })
	}

	const updatedApp = await prisma.application.update({
		where: { id: applicationIdStr },
		data: { status: status as any }
	})

	return res.json(updatedApp)
}
