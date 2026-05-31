import { Router } from 'express'
import { getSubcategories } from '../controllers/subcategory.controller'

const router = Router()
router.get('/', getSubcategories)
export default router
