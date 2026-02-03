import express from "express";
import { getConversations, getMessages } from "../control/chat/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", authMiddleware, getConversations);
router.get("/messages/:email", authMiddleware, getMessages);

export default router;
