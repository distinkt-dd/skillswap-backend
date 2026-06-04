import { z } from 'zod'

const idRegex = /^[a-zA-Z0-9]+$/

export const userSchema = z.object({
	id: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	name: z.string().min(1, 'Имя отсутствует'),
	email: z.string().email('Некорректный email'),
	description: z.string().min(1, 'Описание обязательно'),
	gender: z.string().min(1, 'Пол обязателен для заполнения'),
	birthday: z.string().min(1, 'Заполните дату'),
	cityId: z
		.string()
		.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
	subcategoriesIds: z
		.array(
			z
				.string()
				.regex(idRegex, 'ID может содержать только латинские буквы и цифры'),
		)
		.default([]),
	avatar: z.string().min(1, 'Аватар обязателен'),
})

export const userPassUpdateSchema = z
	.object({
		password: z.string().min(8, 'Более 8 символов'),
	})
	.merge(userSchema.pick({ id: true }))

export const getUserByIdSchema = userSchema
export const getUsersSchema = z.array(userSchema)

export const userDataUpdateSchema = userSchema
	.pick({ id: true })
	.merge(userSchema.partial().omit({ id: true }))

export const userLoginSchema = userSchema
	.pick({ email: true })
	.merge(userPassUpdateSchema.omit({ id: true }))

export const userRegisterSchema = userSchema
	.merge(userPassUpdateSchema)
	.omit({ id: true })

export const passwordChangeSchema = z.object({
	newPassword: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
})
