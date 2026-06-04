import { z } from 'zod'

const idRegex = /^[a-zA-Z0-9]+$/

export const subcategoriesSchema = z.object({
	id: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	name: z
		.string()
		.min(3, 'Название должно быть минимум 3 символа')
		.max(100, 'Название не может быть длиннее 100 символов'),
	categoryId: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
})

export const getSubcategoriesSchema = z.array(subcategoriesSchema)
