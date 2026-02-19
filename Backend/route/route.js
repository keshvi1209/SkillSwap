import { Router } from "express";
import { signup, login } from "../control/auth/userController.js";
import { canteachskills } from "../control/skills/canteachskillsController.js";
import { tolearnskills } from "../control/skills/tolearnskillsController.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import { getCanTeachSkills, getToLearnSkills } from "../control/skills/getSkillsController.js";
import { getcanteachbyid, putcanteachbyid } from "../control/skills/editSkillsController.js";
import { setCanTeachPreferences, setToLearnPreferences } from "../control/skills/SetPreferencesController.js";
import recommendations from "../control/recommendation/recommendationController.js";
import { getDetails, getusercompletedetails } from "../control/profile/getDetailsController.js";
import { getupdateddetails, updatedetails } from "../control/profile/basicDetailsController.js";
import { saveAvailability, getAvailability , updateAvailability } from "../control/booking/availabilityController.js";
import {
  createBooking,
  getBookingHistory,
} from "../control/booking/bookingController.js";
import {
  getReceivedRequests,
  updateBookingStatus,
} from "../control/booking/handlebookingrequest.js";
import googleAuth from "../control/auth/googleAuth.js";
import { searchUsers } from "../control/recommendation/searchController.js";
import meet from "./meet.js";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

router.post("/signup", signup);
router.post("/login", login);
router.post("/auth/google", googleAuth);

router.use(authMiddleware);
router.use("/meet", meet);
router.post("/canteachskills", upload.array("certificates", 10), canteachskills);
router.post("/tolearnskills", tolearnskills);
router.get("/getcanteachskills", getCanTeachSkills);
router.get("/gettolearnskills", getToLearnSkills);
router.get("/editcanteachskills/:id", getcanteachbyid);
router.put("/savecanteachskills/:id", putcanteachbyid);
router.patch("/canteachpreferences/:id", setCanTeachPreferences);
router.patch("/tolearnpreferences/:id", setToLearnPreferences);
router.get("/recommendations/:id", recommendations);
router.get("/getdetails/:id", getDetails);
router.get("/getupdateddetails/:id", getupdateddetails);
router.put("/updatedetails", updatedetails);
router.get("/getusercompletedetails/:id", getusercompletedetails);
router.post("/saveavailability", saveAvailability);
router.get("/getavailability/:userId", getAvailability);
router.put("/updateavailability/:userId", updateAvailability);
router.post('/bookings', createBooking);
router.get('/history', getBookingHistory);
router.get("/teacher/:teacherId", getReceivedRequests);
router.patch("/:bookingId/status", updateBookingStatus);
router.get("/search", searchUsers);

export default router;
