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
import { validateRegister, validateLogin } from "../validators/authValidator.js";

const router = express.Router()

router.post('/register/:role', authLimiter, validateRegister, register)
router.post('/login', authLimiter, validateLogin, login)
router.post('/google', authLimiter, googleLogin)
router.post('/logout', isAuthenticated, logout)
router.get('/me', isAuthenticated, getMe);

export default router;
