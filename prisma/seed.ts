import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
async function main() {
	// Категории
	const categories = [
		{ id: '1', name: 'Бизнес', type: 'business' },
		{ id: '2', name: 'Креатив', type: 'creative' },
		{ id: '3', name: 'Языки', type: 'languages' },
		{ id: '4', name: 'Образование', type: 'education' },
		{ id: '5', name: 'Дом', type: 'home' },
		{ id: '6', name: 'Здоровье', type: 'health' }
	]
	for (const cat of categories) {
		await prisma.category.upsert({
			where: { id: cat.id },
			update: {},
			create: cat
		})
	}

	// Подкатегории (пример)
	const subcategories = [
		{ id: '1', name: 'Маркетинг', categoryId: '1' },
		{ id: '2', name: 'Дизайн', categoryId: '2' },
		{ id: '3', name: 'Английский', categoryId: '3' }
	]
	for (const sub of subcategories) {
		await prisma.subcategory.upsert({
			where: { id: sub.id },
			update: {},
			create: sub
		})
	}

	// Города
	const cities = [
		{ id: '1', name: 'Москва' },
		{ id: '2', name: 'Санкт-Петербург' },
		{ id: '3', name: 'Казань' }
	]
	for (const city of cities) {
		await prisma.city.upsert({
			where: { id: city.id },
			update: {},
			create: city
		})
	}
}

main().catch(console.error)
