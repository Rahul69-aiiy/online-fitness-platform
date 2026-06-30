import express from "express";
import {
  register,
  login,
  logout,
  getMe, 
  googleLogin
} from "../controllers/authController.js";

import {isAuthenticated} from "../middlewares/middleware.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";

const router = express.Router()

router.post('/register/:role', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/google', googleLogin)
router.post('/logout', isAuthenticated, logout)
router.get('/me', isAuthenticated, getMe);

export default router;