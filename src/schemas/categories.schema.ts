import { z } from 'zod'

const idRegex = /^[a-zA-Z0-9]+$/

export const categoriesSchema = z.object({
	id: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	name: z
		.string()
		.min(3, 'Название должно быть минимум 3 символа')
		.max(100, 'Название не может быть длиннее 100 символов'),
	type: z.string().max(100, 'Тип не может быть длиннее 100 символов'),
})

export const getCategoriesSchema = z.array(categoriesSchema)
