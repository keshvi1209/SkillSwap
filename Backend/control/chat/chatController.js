import Message from "../../model/chat/Message.js";
import User from "../../model/user/user.js";

// Get list of conversations for the current user
export const getConversations = async (req, res) => {
    try {
        const userEmail = req.user.email;

        // Aggregate to find unique conversation partners and the last message
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderEmail", userEmail] },
                            "$receiverEmail",
                            "$senderEmail"
                        ]
                    },
                    lastMessage: { $first: "$content" },
                    lastMessageTime: { $first: "$createdAt" },
                }
            },
            {
                $lookup: {
                    from: "users", // MongoDB defaults to lowercase plural of model name
                    localField: "_id",
                    foreignField: "email",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    email: "$_id",
                    name: "$userDetails.name",
                    lastMessage: 1,
                    lastMessageTime: 1,
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Get messages for a specific chat
export const getMessages = async (req, res) => {
    try {
        const { email: otherEmail } = req.params;
        const userEmail = req.user.email;

        const messages = await Message.find({
            $or: [
                { senderEmail: userEmail, receiverEmail: otherEmail },
                { senderEmail: otherEmail, receiverEmail: userEmail }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
