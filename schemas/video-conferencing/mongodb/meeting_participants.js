// meeting_participants: Tracks users joining meetings with their roles and media state.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const meetingParticipantsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    display_name: { type: String, required: true },
    role: { type: String, enum: ["host", "co_host", "moderator", "attendee", "viewer"], required: true, default: "attendee" },
    joined_at: { type: Date, required: true, default: Date.now },
    left_at: { type: Date, default: null },
    duration_seconds: { type: Number, default: null },
    is_camera_on: { type: Boolean, required: true, default: false },
    is_mic_on: { type: Boolean, required: true, default: false },
    is_screen_sharing: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

meetingParticipantsSchema.index({ meeting_id: 1, user_id: 1 }, { unique: true, sparse: true });
meetingParticipantsSchema.index({ user_id: 1 });
meetingParticipantsSchema.index({ meeting_id: 1, joined_at: 1 });

module.exports = mongoose.model("MeetingParticipant", meetingParticipantsSchema);
