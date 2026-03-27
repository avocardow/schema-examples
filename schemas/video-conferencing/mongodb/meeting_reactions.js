// meeting_reactions: Emoji reactions sent by participants during meetings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const meetingReactionsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    emoji: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

meetingReactionsSchema.index({ meeting_id: 1, created_at: 1 });
meetingReactionsSchema.index({ meeting_id: 1, emoji: 1 });

module.exports = mongoose.model("MeetingReaction", meetingReactionsSchema);
