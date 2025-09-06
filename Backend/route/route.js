import { Router } from "express";
import { signup, login } from "../control/userController.js";
import { canteachskills } from "../control/canteachskillsController.js";
import { tolearnskills } from "../control/tolearnskillsController.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import { getCanTeachSkills,getToLearnSkills } from "../control/getSkillsController.js";
import { getcanteachbyid, putcanteachbyid } from "../control/editSkillsController.js";
import { setCanTeachPreferences, setToLearnPreferences } from "../control/SetPreferencesController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

router.post("/signup", signup);
router.post("/login", login);
router.use(authMiddleware);
router.post("/canteachskills", upload.array("certificates", 10), canteachskills);
router.post("/tolearnskills", tolearnskills);
router.get("/getcanteachskills", getCanTeachSkills);
router.get("/gettolearnskills", getToLearnSkills);
router.get("/editcanteachskills/:id", getcanteachbyid);
router.put("/savecanteachskills/:id", putcanteachbyid);
router.patch("/canteachpreferences/:id", setCanTeachPreferences);
router.patch("/tolearnpreferences/:id", setToLearnPreferences);

export default router;
