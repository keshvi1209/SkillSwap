import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // 1️⃣ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      picture,
      email_verified,
      sub: googleId,
    } = payload;

    if (!email_verified) {
      return res.status(401).json({
        success: false,
        message: "Email not verified by Google",
      });
    }

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // 3️⃣ Create new Google user
      user = await User.create({
        name,
        email,
        password: null,
        googleTokens: {
          googleId,
          picture,
          provider: "google",
          lastLogin: new Date(),
        },
      });
    } else {
      // 4️⃣ Update Google login info
      user.googleTokens = {
        googleId,
        picture,
        provider: "google",
        lastLogin: new Date(),
      };

      await user.save();
    }

    // 5️⃣ Generate App JWT
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

    return res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};

export default googleAuth;
