import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve("server/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});
