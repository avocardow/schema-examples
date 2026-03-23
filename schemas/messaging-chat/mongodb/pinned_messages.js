// pinned_messages: tracks which messages have been pinned in a conversation, by whom, and when.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pinned_messagesSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  pinned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pinned_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

pinned_messagesSchema.index({ conversation_id: 1, message_id: 1 }, { unique: true });
pinned_messagesSchema.index({ conversation_id: 1, pinned_at: 1 });

module.exports = mongoose.model("PinnedMessage", pinned_messagesSchema);
