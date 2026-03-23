// bookmarked_messages: stores user-saved messages with optional notes, scoped per user with cascade cleanup.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookmarked_messagesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    note: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

bookmarked_messagesSchema.index({ user_id: 1, message_id: 1 }, { unique: true });
bookmarked_messagesSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("BookmarkedMessage", bookmarked_messagesSchema);
