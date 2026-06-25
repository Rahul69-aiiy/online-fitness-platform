import { Router } from 'express'
import { authorizeRoles, isAuthenticated } from "../middlewares/middleware.js"
import { getTrainerById, getTrainers, updateTrainerProfile } from '../controllers/trainerController.js'

const router = Router()
// Public routes
router.get('/', getTrainers)

// Protected routes
router.get('/:id', getTrainerById)
router.put('/profile', isAuthenticated, authorizeRoles('TRAINER'), updateTrainerProfile)

export default router