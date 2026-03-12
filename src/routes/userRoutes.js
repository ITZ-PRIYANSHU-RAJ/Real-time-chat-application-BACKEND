import { Router } from "express";
import { searchUsers, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", protect, searchUsers);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
