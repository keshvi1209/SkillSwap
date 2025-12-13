import express from 'express';
import axios from 'axios';
import { google } from 'googleapis';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../model/user.js';

const router = express.Router();

function createClient(tokens) {
  const client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  client.setCredentials(tokens);
  return client;
}

router.use(authMiddleware);

router.post('/create', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.googleTokens) {
      return res.status(401).json({ loginRequired: true });
    }

    const { googleTokens } = user;
    const oauth2Client = createClient(googleTokens);

    // refresh / update tokens if needed
    const newToken = await oauth2Client.getAccessToken(); // refreshes automatically if refresh_token present
    const accessToken = newToken?.token || oauth2Client.credentials.access_token || googleTokens.access_token;

    // optionally update stored tokens if googleapis refreshed them
    if (oauth2Client.credentials) {
      user.googleTokens = { ...user.googleTokens, ...oauth2Client.credentials };
      await user.save();
    }

    const body = { displayName: req.body.title || 'Scheduled meeting' };

    const response = await axios.post('https://meet.googleapis.com/v2/spaces', body, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
    });

    const meetingLink = response.data?.meetingUri || null;
    return res.json({ meetingLink, raw: response.data });
  } catch (err) {
    console.error('Create meeting error', err.response?.data || err.message || err);
    if (err.response?.status === 401) return res.status(401).json({ loginRequired: true });
    return res.status(500).json({ error: 'Failed to create meeting' });
  }
});

export default router;
