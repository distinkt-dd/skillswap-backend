import { z } from 'zod'

const idRegex = /^[a-zA-Z0-9]+$/

export const offersSchema = z.object({
	id: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	userId: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	name: z
		.string()
		.min(3, 'Название должно быть минимум 3 символа')
		.max(100, 'Название не может быть длиннее 100 символов'),
	subcategoryId: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	description: z
		.string()
		.min(10, 'Описание должно быть минимум 10 символов')
		.max(1000, 'Описание не может быть длиннее 1000 символов'),
	images: z
		.array(z.string().url('Каждое изображение должно быть валидным URL'))
		.default([]),
	userLikedIds: z
		.array(
			z
				.string()
				.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
		)
		.default([]),
})

export const getOffersSchema = z.array(offersSchema)
export const getOfferByIdSchema = offersSchema
// Аналог .omit() в Zod
export const createOfferSchema = offersSchema.omit({
	id: true,
	userLikedIds: true,
	userId: true,
})
// Аналог .pick() + .partial()
export const offerDataUpdateSchema = offersSchema
	.pick({ id: true })
	.merge(offersSchema.partial().omit({ id: true }))

export const favoritesUpdateSchema = z.array(
	z
		.string()
		.regex(
			/^[a-zA-Z0-9]+$/,
			'ID должен содержать только латинские буквы и цифры',
		),
)
