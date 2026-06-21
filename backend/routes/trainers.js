import express from "router"
import { authorizeRoles, isAuthenticated } from "../middlewares/middleware"
import { getTrainerById, getTrainers, updateTrainerProfile } from '../controllers/trainerController'

const router = express.router()
// Public routes
router.post('/', getTrainers)

// Protected routes
router.post('/:id', getTrainerById)
router.put('/profile', isAuthenticated, authorizeRoles('TRAINER'), updateTrainerProfile)

export default router