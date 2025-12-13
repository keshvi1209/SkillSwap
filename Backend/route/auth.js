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

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/meetings.space.created",
];

router.get("/login", (req, res) => {
  console.log("🔵 /auth/login hit");
  console.log("CLIENT_ID:", process.env.CLIENT_ID ? "✅" : "❌ Missing");
  console.log(
    "CLIENT_SECRET:",
    process.env.CLIENT_SECRET ? "✅" : "❌ Missing"
  );
  console.log("REDIRECT_URI:", process.env.REDIRECT_URI || "❌ Missing");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log("🔗 Generated auth URL (Google)");
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
        googleTokens: tokens,
      });
    } else {
      user.googleTokens = tokens;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    const frontend = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    return res.redirect(`${frontend}/login?token=${token}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/logout", (req, res) => {
  return res.json({ success: true, message: "Logged out" });
});

router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ authenticated: false });

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      authenticated: true,
      user,
    });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
});

export default router;
