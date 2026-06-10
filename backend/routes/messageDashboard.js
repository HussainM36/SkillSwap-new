const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    const chats = [];

    messages.forEach((msg) => {
      const friend =
        msg.sender._id.toString() === userId
          ? msg.receiver
          : msg.sender;

      const exists = chats.find(
        (c) => c.friendId === friend._id.toString()
      );

      if (!exists) {
        chats.push({
          friendId: friend._id,
          name: friend.name,
          lastMessage: msg.text,
          time: msg.createdAt,
        });
      }
    });

    res.json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;