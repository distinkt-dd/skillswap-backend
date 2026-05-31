import { Request, Response } from 'express'

import { prisma } from '../lib/prisma'

export const getSubcategories = async (req: Request, res: Response) => {
	try {
		const subcategories = await prisma.subcategory.findMany()
		res.json(subcategories)
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch subcategories' })
	}
}
