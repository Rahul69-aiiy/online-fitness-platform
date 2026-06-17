import express from "router"
import { isAuthenticated } from "../middlewares/middleware"

const router = express.router()

router.post('/trainers', isAuthenticated)
router.post('/trainer/:id', isAuthenticated)

export default router