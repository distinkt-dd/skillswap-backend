import cors from 'cors'
import 'dotenv/config'
import express from 'express'

import categoryRoutes from './routes/category.routes'
import cityRoutes from './routes/city.routes'
import favoriteRoutes from './routes/favorite.routes'
import offerRoutes from './routes/offer.routes'
import subcategoryRoutes from './routes/subcategory.routes'
import userRoutes from './routes/user.routes'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Маршруты
app.use('/users', userRoutes)
app.use('/categories', categoryRoutes)
app.use('/subcategories', subcategoryRoutes)
app.use('/cities', cityRoutes)
app.use('/offers', offerRoutes)
app.use('/favorites', favoriteRoutes)

// Обработка ошибок 404
app.use((req, res) => {
	res.status(404).json({ error: 'Не найден!' })
})

app.listen(PORT, () => {
	console.log(`Сервер запущен, порт ${PORT}`)
})
