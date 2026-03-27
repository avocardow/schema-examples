// recording_access_grants: Per-user access permissions for meeting recordings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recordingAccessGrantsSchema = new mongoose.Schema(
  {
    recording_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recording", required: true },
    granted_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    granted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    permission: { type: String, enum: ["view", "download"], required: true, default: "view" },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

recordingAccessGrantsSchema.index({ recording_id: 1, granted_to: 1 }, { unique: true });
recordingAccessGrantsSchema.index({ granted_to: 1 });

module.exports = mongoose.model("RecordingAccessGrant", recordingAccessGrantsSchema);
