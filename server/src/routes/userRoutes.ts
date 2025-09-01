import express from "express";
import {
	signup,
	signin,
	getProfile,
	updateProfile,
	updateUser,
	getUser,
} from "../controllers/userController";
import { authenticateToken, requireOwnership } from "../middleware/auth";

const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", signup);
router.post("/signin", signin);

// Protected routes (authentication required)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

// User management routes (replacing Clerk user routes)
router.get("/:userId", authenticateToken, requireOwnership, getUser);
router.put("/:userId", authenticateToken, requireOwnership, updateUser);

export default router;
