import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getCities = async (req: Request, res: Response) => {
	try {
		const cities = await prisma.city.findMany()
		res.json(cities)
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch cities' })
	}
}
