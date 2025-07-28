import { Router } from "express";
import { signup, login } from "../control/userController.js";
import { canteachskills } from "../control/canteachskillsController.js";
import { tolearnskills } from "../control/tolearnskillsController.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

router.post("/signup", signup);
router.post("/login", login);
router.post("/canteachskills", upload.array("certificates", 10), canteachskills);
router.post("/tolearnskills", tolearnskills);

export default router;
