// meeting_chat_messages: In-meeting chat messages, supporting both broadcast and direct messages.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const meetingChatMessagesSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

meetingChatMessagesSchema.index({ meeting_id: 1, created_at: 1 });
meetingChatMessagesSchema.index({ sender_id: 1 });

module.exports = mongoose.model("MeetingChatMessage", meetingChatMessagesSchema);
