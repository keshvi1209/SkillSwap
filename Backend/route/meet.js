import express from "express";
import { google } from "googleapis";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../model/user/user.js";
import Meeting from "../model/booking/meeting.js"; // 1. IMPORT THE MEETING MODEL

const router = express.Router();

router.use(authMiddleware);

// --- ROUTE 1: Schedule Logic (Google + MongoDB) ---
router.post("/schedule", async (req, res) => {
  try {
    // 2. EXTRACT NEW FIELDS: studentId and skillName are needed for MongoDB
    const {
      summary,
      description,
      startTime,
      endTime,
      studentEmail,
      studentId,
      skillName,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.googleTokens) {
      return res.status(401).json({ loginRequired: true });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI,
    );
    oauth2Client.setCredentials({
      refresh_token: user.googleTokens.refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Define the Event
    const event = {
      summary: summary || "Class Session",
      description: description || "Scheduled via Platform",
      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email: studentEmail }],
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // Insert Event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    console.log("✅ Google Event Created:", response.data.htmlLink);

    // 3. SAVE TO MONGODB
    // This allows you to show the schedule in your own React app
    const newMeeting = await Meeting.create({
      teacherId: req.user.id, // The logged-in user is the teacher
      studentId: studentId, // Passed from frontend
      skillName: skillName || "Class",
      startTime: startTime,
      endTime: endTime,
      meetLink: response.data.hangoutLink,
      googleEventId: response.data.id,
    });

    console.log("✅ MongoDB Meeting Saved:", newMeeting._id);

    return res.json({
      success: true,
      meetLink: response.data.hangoutLink,
      calendarLink: response.data.htmlLink,
      meetingId: newMeeting._id,
    });
  } catch (err) {
    console.error("❌ Calendar Schedule Error:", err);
    if (err.code === 401) return res.status(401).json({ loginRequired: true });
    return res.status(500).json({ error: "Failed to schedule meeting" });
  }
});

// --- ROUTE 2: Fetch Calendar Data (For React UI) ---
router.get("/my-calendar", async (req, res) => {
  try {
    const userId = req.user.id;

    // Find meetings where I am EITHER the teacher OR the student
    const meetings = await Meeting.find({
      $or: [{ teacherId: userId }, { studentId: userId }],
    })
      .populate("teacherId", "name email") // Get details to display "Taught by X"
      .populate("studentId", "name email") // Get details to display "Student: Y"
      .sort({ startTime: 1 }); // Sort by earliest first

    return res.json(meetings);
  } catch (err) {
    console.error("❌ Fetch Calendar Error:", err);
    return res.status(500).json({ error: "Failed to fetch calendar" });
  }
});

export default router;
