// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// ✅ Get all messages between two users (userId & friendId)
router.get("/messages/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    console.log("USER:", userId);
    console.log("FRIEND:", friendId);

    if (!userId || !friendId) {
      return res.status(400).json({
        message: "Missing IDs",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          receiver: friendId,
        },
        {
          sender: friendId,
          receiver: userId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// ✅ Send a new message (used by FriendsChat.jsx)
router.post("/send", async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await newMessage.save();

    res.status(201).json({
      message: "✅ Message sent successfully",
      newMessage,
    });
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.status(500).json({ message: "Error saving message" });
  }
});

module.exports = router;
