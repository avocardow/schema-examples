// meetings: Individual meeting sessions within rooms, tracking lifecycle and scheduling.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const meetingsSchema = new mongoose.Schema(
  {
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    title: { type: String, default: null },
    status: { type: String, enum: ["scheduled", "live", "ended", "cancelled"], required: true, default: "scheduled" },
    scheduled_start: { type: Date, default: null },
    scheduled_end: { type: Date, default: null },
    actual_start: { type: Date, default: null },
    actual_end: { type: Date, default: null },
    max_participants: { type: Number, default: null },
    enable_waiting_room: { type: Boolean, default: null },
    host_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participant_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

meetingsSchema.index({ room_id: 1, scheduled_start: 1 });
meetingsSchema.index({ host_id: 1 });
meetingsSchema.index({ status: 1 });
meetingsSchema.index({ scheduled_start: 1 });
meetingsSchema.index({ actual_start: 1 });

module.exports = mongoose.model("Meeting", meetingsSchema);
