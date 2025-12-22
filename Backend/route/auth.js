import express from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// In auth.js
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar", // <--- Add this line
];

router.get("/login", (req, res) => {
  // ... (Logging remains the same)
  console.log("🔵 /auth/login hit");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // 'consent' forces a refresh token, but merging is still safer
    scope: SCOPES,
  });

  return res.redirect(url);
});

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    let user = await User.findOne({ email: data.email });

    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        googleId: data.id,
        googleTokens: tokens, // First login always has refresh_token
      });
    } else {
      // --- CHANGED SECTION START ---
      // Merge new tokens with existing ones to preserve refresh_token
      // if the new response doesn't include it.
      user.googleTokens = {
        ...user.googleTokens,
        ...tokens,
      };

      // If you changed your Schema to 'type: Object', Mongoose needs
      // to be told that this Mixed type field has been modified.
      user.markModified('googleTokens');
      
      await user.save();
      // --- CHANGED SECTION END ---
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    const frontend = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    return res.redirect(`${frontend}/login?token=${token}`);
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ... (Rest of file remains the same)

export default router;