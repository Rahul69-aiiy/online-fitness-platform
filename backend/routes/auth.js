import express from "express";
import {
  register,
  login,
  logout,
  getMe, 
  googleLogin
} from "../controllers/authController.js";

import {
  authLimiter,
  isAuthenticated,
} from "../middlewares/middleware.js";

const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/google', authLimiter, googleLogin)
router.post('/logout', isAuthenticated, logout)
router.get('/me', isAuthenticated, getMe);

export default router;