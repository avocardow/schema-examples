// breakout_rooms: Breakout rooms within a meeting for smaller group discussions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const breakoutRoomsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["pending", "open", "closed"], required: true, default: "pending" },
    opened_at: { type: Date, default: null },
    closed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

breakoutRoomsSchema.index({ meeting_id: 1, position: 1 });
breakoutRoomsSchema.index({ meeting_id: 1, status: 1 });

module.exports = mongoose.model("BreakoutRoom", breakoutRoomsSchema);
