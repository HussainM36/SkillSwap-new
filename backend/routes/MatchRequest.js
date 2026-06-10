const express = require("express");
const router = express.Router();

const MatchRequest = require("../models/MatchRequest");
const User = require("../models/User");

// SEND REQUEST
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "senderId and receiverId required",
      });
    }

    const existing = await MatchRequest.findOne({
      senderId,
      receiverId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Request already exists",
      });
    }

    const request = await MatchRequest.create({
      senderId,
      receiverId,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ACCEPT REQUEST
router.put("/accept/:id", async (req, res) => {
  try {
    const request = await MatchRequest.findByIdAndUpdate(
      req.params.id,
      {
        isAccepted: true,
        isRejected: false,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// REJECT REQUEST
router.put("/reject/:id", async (req, res) => {
  try {
    const request = await MatchRequest.findByIdAndUpdate(
      req.params.id,
      {
        isAccepted: false,
        isRejected: true,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// RECEIVED REQUESTS
router.get("/received/:receiverId", async (req, res) => {
  try {
    const requests = await MatchRequest.find({
      receiverId: req.params.receiverId,
    }).populate("senderId", "name email");

    res.json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// SENT REQUESTS
router.get("/sent/:senderId", async (req, res) => {
  try {
    const requests = await MatchRequest.find({
      senderId: req.params.senderId,
    }).populate("receiverId", "name email");

    res.json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// FRIENDS LIST
router.get("/friends/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const requests = await MatchRequest.find({
      isAccepted: true,
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    const friends = requests.map((request) => {
      return request.senderId._id.toString() === userId
        ? request.receiverId
        : request.senderId;
    });

    res.json({
      success: true,
      data: friends,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// PENDING REQUESTS
router.get("/pending", async (req, res) => {
  try {
    const { userId } = req.query;

    const requests = await MatchRequest.find({
      receiverId: userId,
      isAccepted: false,
      isRejected: false,
    }).populate("senderId", "name email");

    res.json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// USER DETAILS
router.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("name email");

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// UNFRIEND
router.delete("/unfriend/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const deleted = await MatchRequest.findOneAndDelete({
      isAccepted: true,
      $or: [
        {
          senderId: userId,
          receiverId: friendId,
        },
        {
          senderId: friendId,
          receiverId: userId,
        },
      ],
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }

    res.json({
      success: true,
      message: "Friend removed",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;