import express from "express";
import { registerUser, authUser, allUsers, update } from "../controllers/user.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Routes that don't require authentication
router.post("/signup", registerUser);
router.post("/login", authUser);

// Routes that require authentication
router.use(protect);
router.get("/", allUsers);
router.put("/update", update);

export default router;
