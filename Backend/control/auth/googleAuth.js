import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";
import Canteach from "../../model/skills/canteachskillsModel.js";
import Tolearn from "../../model/skills/tolearnskillsModel.js";

const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    // 1️⃣ Create OAuth Client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.CLIENT_SECRET,
      "postmessage", // required for popup flow
    );

    // 2️⃣ Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // 3️⃣ Get Google user info
    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const { email, name, picture, id: googleId } = data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to retrieve Google user email",
      });
    }

    // 4️⃣ Find or Create User
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
          refreshToken: tokens.refresh_token,
          lastLogin: new Date(),
        },
      });
    } else {
      user.googleTokens = {
        googleId,
        picture,
        provider: "google",
        refreshToken: tokens.refresh_token || user.googleTokens?.refreshToken,
        lastLogin: new Date(),
      };

      await user.save();
    }

    // 5️⃣ Check if user has skills (Optimized with exists())
    const isCanTeachEmpty = user.canTeachPreferences.length === 0;
    const isToLearnEmpty = user.toLearnPreferences.length === 0;

    const profileIncomplete = isCanTeachEmpty || isToLearnEmpty;

    console.log(`User ${email} profile incomplete:`, profileIncomplete);

    // 6️⃣ Generate App JWT
    const appToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 7️⃣ Send response
    return res.status(200).json({
      success: true,
      token: appToken,
      profileIncomplete,
      missing: {
        canTeachPreferences: isCanTeachEmpty,
        toLearnPreferences: isToLearnEmpty,
      },

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
