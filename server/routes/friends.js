import express from "express"
import { acceptOrRejectRequest, addRemoveFriend, getFriendRequestsList, getUserFriends } from "../controllers/friends.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/list", protect, getFriendRequestsList);
router.get("/friends", protect, getUserFriends);
router.patch("/add", protect, addRemoveFriend);
router.patch("/requests", protect, acceptOrRejectRequest);

export default router;