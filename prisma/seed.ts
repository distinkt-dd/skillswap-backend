import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import data from './data.json'

async function main() {
	console.log('Starting seeding...')
	await prisma.offer.deleteMany({});
	await prisma.user.deleteMany({});
	await prisma.subcategory.deleteMany({});
	await prisma.category.deleteMany({});
	await prisma.city.deleteMany({});
	// 1. Города
	console.log('Seeding cities...')
	for (const city of data.cities) {
		await prisma.city.upsert({
			where: { id: city.id },
			update: {},
			create: city,
		})
	}

	// 2. Категории
	console.log('Seeding categories...')
	for (const cat of data.categories) {
		await prisma.category.upsert({
			where: { id: cat.id },
			update: {},
			create: cat,
		})
	}

	// 3. Подкатегории
	console.log('Seeding subcategories...')
	for (const sub of data.subcategories) {
		await prisma.subcategory.upsert({
			where: { id: sub.id },
			update: {},
			create: sub,
		})
	}

	// 4. Пользователи
	console.log('Seeding users...')
	for (const user of data.users) {
		await prisma.user.upsert({
			where: { id: user.id },
			update: {
				name: user.name,
				email: user.email,
				description: user.description,
				avatar: user.avatar,
				gender: user.gender,
				birthday: user.birthday,
				cityId: user.cityId,
				subcategoriesIds: user.subcategoriesIds,
			},
			create: user,
		})
	}

	// 5. Офферы (Предложения)
	console.log('Seeding offers...')
	for (const offer of data.offers) {
		await prisma.offer.upsert({
			where: { id: offer.id },
			update: {
				userId: offer.userId,
				name: offer.name,
				subcategoryId: offer.subcategoryId,
				createdAt: offer.createdAt,
				description: offer.description,
				images: offer.images,
				userLikedIds: offer.userLikedIds,
			},
			create: {
				...offer,
				createdAt: offer.createdAt,
			},
		})
	}

	console.log('Seeding completed successfully! 🎉')
}

main()
	.catch(e => {
		console.error('Error seeding database: ', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
