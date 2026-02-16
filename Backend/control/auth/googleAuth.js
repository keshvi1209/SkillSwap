import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";

const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;   // 🔥 Now receiving CODE, not token

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    // 1️⃣ Create OAuth client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.CLIENT_SECRET,
      "postmessage" // IMPORTANT for popup flow
    );

    // 2️⃣ Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);

    oAuth2Client.setCredentials(tokens);

    // 3️⃣ Get user info from Google
    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    const { email, name, picture, id: googleId } = data;

    // 4️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        googleTokens: {
          googleId,
          picture,
          provider: "google",
          refreshToken: tokens.refresh_token, // 🔥 SAVE THIS
          lastLogin: new Date(),
        },
      });
    } else {
      // Update existing user
      user.googleTokens = {
        googleId,
        picture,
        provider: "google",
        refreshToken: tokens.refresh_token || user.googleTokens?.refreshToken,
        lastLogin: new Date(),
      };

      await user.save();
    }

    // 5️⃣ Generate your app JWT
    const appToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default googleAuth;
