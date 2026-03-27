// meeting_polls: Polls created within meetings for gathering participant feedback.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const meetingPollsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    options: { type: mongoose.Schema.Types.Mixed, required: true },
    poll_type: { type: String, enum: ["single_choice", "multiple_choice"], required: true, default: "single_choice" },
    status: { type: String, enum: ["draft", "active", "closed"], required: true, default: "draft" },
    launched_at: { type: Date, default: null },
    closed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

meetingPollsSchema.index({ meeting_id: 1, status: 1 });
meetingPollsSchema.index({ meeting_id: 1, created_at: 1 });

module.exports = mongoose.model("MeetingPoll", meetingPollsSchema);
