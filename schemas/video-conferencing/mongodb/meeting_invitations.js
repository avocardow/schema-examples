// meeting_invitations: Invitations sent to users for upcoming meetings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const meetingInvitationsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    inviter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invitee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined", "tentative"], required: true, default: "pending" },
    responded_at: { type: Date, default: null },
    message: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

meetingInvitationsSchema.index({ meeting_id: 1, invitee_id: 1 }, { unique: true });
meetingInvitationsSchema.index({ invitee_id: 1, status: 1 });
meetingInvitationsSchema.index({ meeting_id: 1, status: 1 });

module.exports = mongoose.model("MeetingInvitation", meetingInvitationsSchema);
