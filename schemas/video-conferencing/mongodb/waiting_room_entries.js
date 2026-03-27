// waiting_room_entries: Tracks users waiting to be admitted into a meeting.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const waitingRoomEntriesSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    display_name: { type: String, required: true },
    status: { type: String, enum: ["waiting", "admitted", "rejected"], required: true, default: "waiting" },
    admitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    responded_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

waitingRoomEntriesSchema.index({ meeting_id: 1, status: 1 });
waitingRoomEntriesSchema.index({ meeting_id: 1, created_at: 1 });

module.exports = mongoose.model("WaitingRoomEntry", waitingRoomEntriesSchema);
