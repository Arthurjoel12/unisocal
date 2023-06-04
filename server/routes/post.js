import express from "express"
import { allComments, allLikes, commentPost, createPost, getFeedPosts, getUserPosts, likePost, postDetail, searchByTags } from "../controllers/post.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(protect, getFeedPosts)
router.route("/postdetail").post(postDetail)
router.route("/like").post(protect, likePost)
router.route("/alllike").post(allLikes)
router.route("/comment").post(protect, commentPost)
router.route("/allcomments").post(allComments)
router.route("/userposts").post(protect, getUserPosts)
router.route("/create").post(protect, createPost)
router.post("/searchByTags", searchByTags);

export default router;