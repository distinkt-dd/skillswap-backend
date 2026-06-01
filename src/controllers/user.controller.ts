import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'
import { TLoginUser, TUpdateUser, TUser } from '../types'
import { generateToken } from '../utils/jwt.util'

// GET /users?email=... (для логина возвращаем с passwordHash)

export const checkMe = async (req: AuthRequest, res: Response) => {
	try {
		const id = req.userId
		const user = await prisma.user.findUnique({ where: { id } })
		if (!user) {
			return res.status(401).json({ message: 'Пользователь не авторизован' })
		}
		const { passwordHash, ...userWithoutHash } = user
		const token = generateToken(user.id)

		res.json({
			user: userWithoutHash as TUser,
			token,
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Login failed' })
	}
}

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password }: TLoginUser = req.body

		const user = await prisma.user.findUnique({ where: { email } })
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' })
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid email or password' })
		}

		const { passwordHash, ...userWithoutHash } = user
		const token = generateToken(user.id)

		res.json({
			user: userWithoutHash as TUser,
			token,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Login failed' })
	}
}

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = Array.isArray(id) ? id[0] : id
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				description: true,
				avatar: true,
				gender: true,
				birthday: true,
				cityId: true,
				subcategoriesIds: true,
			},
		})
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user as TUser)
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' })
	}
}

// POST /users (регистрация)
export const registerUser = async (req: Request, res: Response) => {
	try {
		const { password, ...rest } = req.body // на клиенте уже хеширован
		// Проверка существования email уже выполнена на фронте, но дублируем
		const existing = await prisma.user.findUnique({
			where: { email: rest.email },
		})
		if (existing) {
			return res.status(400).json({ message: 'User already exists' })
		}

		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const newUser = await prisma.user.create({
			data: {
				...rest,
				passwordHash,
				subcategoriesIds: rest.subcategoriesIds || [],
			},
		})

		const token = generateToken(newUser.id)

		const { passwordHash: _, ...userWithoutHash } = newUser

		res.status(201).json({
			user: userWithoutHash as TUser,
			token,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Registration failed' })
	}
}

export const getUsers = async (req: Request, res: Response) => {
	try {
		const { email } = req.query

		// Если передан email, возвращаем пользователя (без passwordHash)
		if (email && typeof email === 'string') {
			const user = await prisma.user.findUnique({
				where: { email },
				select: {
					id: true,
					name: true,
					email: true,
					description: true,
					avatar: true,
					gender: true,
					birthday: true,
					cityId: true,
					subcategoriesIds: true,
				},
			})
			if (!user) {
				// Фронт ожидает пустой массив, а не 404
				return res.status(200).json([])
			}
			return res.json([user])
		}

		// Иначе возвращаем всех пользователей (только публичные поля)
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				description: true,
				avatar: true,
				gender: true,
				birthday: true,
				cityId: true,
				subcategoriesIds: true,
			},
		})
		res.json(users as TUser[])
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}

// PATCH /users/:id (обновление данных, без пароля)
export const updateUserData = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params
		if (req.userId !== id) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		const data: Partial<TUpdateUser> = req.body

		// Подготавливаем данные, фильтруя undefined
		const updateData: any = {}

		if (data.name !== undefined) updateData.name = data.name
		if (data.description !== undefined)
			updateData.description = data.description
		if (data.avatar !== undefined) updateData.avatar = data.avatar
		if (data.gender !== undefined) updateData.gender = data.gender
		if (data.birthday !== undefined) updateData.birthday = data.birthday
		if (data.cityId !== undefined) updateData.cityId = data.cityId

		if (data.subcategoriesIds !== undefined) {
			// Фильтруем undefined и пустые значения
			const cleaned = data.subcategoriesIds.filter(
				(id): id is string => id !== undefined && id !== null,
			)
			updateData.subcategoriesIds = cleaned
		}

		const updated = await prisma.user.update({
			where: { id },
			data: updateData,
		})

		const { passwordHash, ...userWithoutHash } = updated
		res.json(userWithoutHash as TUser)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Update failed' })
	}
}

// PATCH /users/:id/password (обновление пароля)
export const updateUserPassword = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params
		if (req.userId !== id) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		const { newPassword } = req.body
		const passwordHash = await bcrypt.hash(newPassword, 10)
		const updated = await prisma.user.update({
			where: { id },
			data: { passwordHash },
		})
		res.json({ message: 'Password updated successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Password update failed' })
	}
}

// DELETE /users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params
		if (req.userId !== id) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		await prisma.user.delete({ where: { id } })
		res.status(204).send()
	} catch (error) {
		res.status(500).json({ message: 'Deletion failed' })
	}
}
