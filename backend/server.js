// ========================
// Imports
// ========================
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

// Models
const Profile = require("./models/Profile");
const Message = require("./models/Message");

// Routes
const userRoutes = require("./routes/User");
const MatchRequestRoutes = require("./routes/MatchRequest");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageDashboard = require("./routes/messageDashboard");

// ========================
// App Setup
// ========================
const app = express();
const server = http.createServer(app);

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ========================
// Routes
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/matchRequest", MatchRequestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageDashboard);

// ========================
// MongoDB
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ========================
// Multer Setup
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ========================
// Root Route
// ========================
app.get("/", (req, res) => {
  res.send("🚀 SkillSwap API Running");
});

// ========================
// Get Profiles
// ========================
app.get("/api/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching profiles",
    });
  }
});

// ========================
// Get Single Profile
// ========================
app.get("/api/profiles/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching profile",
    });
  }
});

// ========================
// Create Profile
// ========================
app.post(
  "/api/profiles",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        id,
        name,
        email,
        contact,
        skill,
        experience,
        category,
      } = req.body;

      console.log("Received ID:", id);

      if (!id) {
        return res.status(400).json({
          message: "User ID missing",
        });
      }

      const existingProfile =
        await Profile.findById(id);

      if (existingProfile) {
        existingProfile.name = name;
        existingProfile.email = email;
        existingProfile.contact = contact;
        existingProfile.skill = skill;
        existingProfile.experience = experience;
        existingProfile.category = category;

        if (req.file) {
          existingProfile.photo =
            req.file.filename;
        }

        await existingProfile.save();

        return res.status(200).json({
          message: "Profile updated",
          profile: existingProfile,
        });
      }

      const profile = new Profile({
        _id: id,
        name,
        email,
        contact,
        skill,
        experience,
        category,
        photo: req.file
          ? req.file.filename
          : "",
      });

      await profile.save();

      res.status(201).json({
        message: "Profile created",
        profile,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// ========================
// Socket.IO
// ========================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5178",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_room", (chatId) => {
    socket.join(chatId);
    console.log("Joined Room:", chatId);
  });

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text } = data;

      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        text,
      });

      await newMessage.save();

      io.emit("receive_message", newMessage);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5003;

server.listen(PORT, () => {
  console.log(
    `✅ Server running on http://localhost:${PORT}`
  );
});