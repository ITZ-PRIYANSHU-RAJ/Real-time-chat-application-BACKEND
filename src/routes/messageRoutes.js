import { Router } from "express";
import { createMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(protect);
router.get("/:chatId", getMessages);
router.post("/", upload.array("files", 5), createMessage);

export default router;
