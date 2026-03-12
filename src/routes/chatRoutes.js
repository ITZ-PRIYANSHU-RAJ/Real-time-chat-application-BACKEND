import { Router } from "express";
import {
  accessDirectChat,
  createGroupChat,
  getChats,
  updateGroupChat,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getChats);
router.post("/direct", accessDirectChat);
router.post("/group", createGroupChat);
router.put("/group/:chatId", updateGroupChat);

export default router;
