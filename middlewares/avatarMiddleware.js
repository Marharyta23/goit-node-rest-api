import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const suffix = req.user.id;
    const filename = `${base}--${suffix}${ext}`;

    cb(null, filename);
  },
});

export default multer({ storage });
