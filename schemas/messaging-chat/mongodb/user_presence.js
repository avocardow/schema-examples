// user_presence: tracks each user's current presence status, status text/emoji, and activity timestamps.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const userPresenceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["online", "away", "busy", "offline"],
      required: true,
      default: "offline",
    },
    status_text: {
      type: String,
      default: null,
    },
    status_emoji: {
      type: String,
      default: null,
    },
    last_active_at: {
      type: Date,
      default: null,
    },
    last_connected_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

userPresenceSchema.index({ status: 1 });
userPresenceSchema.index({ last_active_at: 1 });

module.exports = mongoose.model("UserPresence", userPresenceSchema);
