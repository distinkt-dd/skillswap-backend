import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

export const validate =
	(schema: z.ZodTypeAny) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.body)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = error.issues.map(issue => ({
					path: issue.path.join('.'),
					message: issue.message,
				}))

				return res.status(400).json({
					error: 'Ошибка валидации данных',
					errors,
				})
			}

			return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
		}
	}
