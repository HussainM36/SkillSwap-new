const mongoose = require("mongoose");

const matchRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },

  isRejected: {
    type: Boolean,
    default: false,
  },

  transactionDateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MatchRequest", matchRequestSchema);