// ========================
// Imports
// ========================
const express           = require("express");
const http              = require("http");
const cors              = require("cors");
const path              = require("path");
const multer            = require("multer");
const mongoose          = require("mongoose");
require('dotenv').config();


const { authenticateToken } = require("./middleware/authMiddleware");


const matchRequestRouter = require('./routes/matchrequest');
const profileRouter      = require('./routes/profile');
const authRouter         = require('./routes/authRoutes');


// ========================
// App Setup
// ========================
const app    = express();
const server = http.createServer(app);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());  // JSON body parsing


// ========================
// Multer Setup
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


// ========================
// Route Mounting
// ========================
// Auth (signup / login)
app.use("/api/auth", authRouter);


// Protected: Match Requests
app.use("/api/matchRequest", authenticateToken, matchRequestRouter);


// Protected: Profiles (create / list others)
app.use("/api/profiles",    authenticateToken, profileRouter);


// Root health check
app.get('/', (req, res) => res.send('API is running...'));


// ========================
// MongoDB Connection
// ========================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// ========================
// Socket.IO Setup
// ========================
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5178"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket","polling"],
});


io.on("connection", socket => {
  console.log("🟢 User connected:", socket.id);
  socket.on("join_room", roomId => {
    socket.join(roomId);
    console.log(`🔵 User joined room: ${roomId}`);
  });
  socket.on("send_message", ({ message, room }) => {
    io.to(room).emit("receive_message", { message, senderId: socket.id });
    console.log(`✉️ Message to room ${room}: ${message}`);
  });
  socket.on("disconnect", () => console.log("🔴 User disconnected:", socket.id));
});


// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});





