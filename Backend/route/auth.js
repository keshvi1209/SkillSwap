import express from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../model/user/user.js";

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

  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
    console.error("Missing Env Vars: CLIENT_ID, CLIENT_SECRET, or REDIRECT_URI");
    return res.status(500).json({ error: "Server misconfiguration: Missing Google Auth Env Vars" });
  }

  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // 'consent' forces a refresh token, but merging is still safer
      scope: SCOPES,
    });

    console.log("Redirecting to Google Auth URL:", url);
    return res.redirect(url);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return res.status(500).json({ error: "Failed to generate auth URL" });
  }
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

    let frontend = process.env.FRONTEND_ORIGIN;
    if (!frontend) {
      console.error("Missing FRONTEND_ORIGIN env var");
      return res.status(500).json({ error: "Configuration Error: FRONTEND_ORIGIN missing" });
    }

    // Remove trailing slash if present to avoid double slashes in redirect
    if (frontend.endsWith("/")) {
      frontend = frontend.slice(0, -1);
    }

    return res.redirect(`${frontend}/login?token=${token}`);
  } catch (err) {
    console.error("Auth Error:", err);
    let frontend = process.env.FRONTEND_ORIGIN;
    if (frontend) {
      if (frontend.endsWith("/")) {
        frontend = frontend.slice(0, -1);
      }
      return res.redirect(`${frontend}/login?error=${encodeURIComponent(err.message)}`);
    }
    return res.status(500).json({ error: err.message });
  }
});

export default router;