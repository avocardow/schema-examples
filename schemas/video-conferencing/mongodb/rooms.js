// rooms: Virtual meeting rooms with configurable features and access controls.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    type: { type: String, enum: ["permanent", "temporary"], required: true, default: "permanent" },
    max_participants: { type: Number, default: null },
    enable_waiting_room: { type: Boolean, required: true, default: false },
    enable_recording: { type: Boolean, required: true, default: false },
    enable_chat: { type: Boolean, required: true, default: true },
    enable_transcription: { type: Boolean, required: true, default: false },
    enable_breakout_rooms: { type: Boolean, required: true, default: false },
    is_private: { type: Boolean, required: true, default: false },
    password_hash: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

roomsSchema.index({ created_by: 1 });
roomsSchema.index({ type: 1 });
roomsSchema.index({ is_private: 1 });

module.exports = mongoose.model("Room", roomsSchema);
