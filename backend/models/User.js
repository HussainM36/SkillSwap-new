const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ Add profile picture
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  },

  // ✅ Friend / match references
  skills: [String],
  matchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
