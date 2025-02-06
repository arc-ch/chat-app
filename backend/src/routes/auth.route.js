import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


// secured routes below

// if a user wants to update profile then it has to be logged in first so add protectRoute middleware
router.put("/update-profile", protectRoute, updateProfile); 
router.get("/check", protectRoute, checkAuth);
export default router;