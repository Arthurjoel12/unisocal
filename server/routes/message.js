import express from "express"
import protect from "../middleware/auth.js"
import { sendMessage, allMessage} from "../controllers/message.js";

const router = express.Router();

router.route("/").post(protect, sendMessage)
router.route("/:chatId").get(protect, allMessage)

export default router;