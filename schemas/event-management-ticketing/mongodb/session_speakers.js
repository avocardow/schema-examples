// session_speakers: Links speakers to sessions with their presentation role.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const sessionSpeakersSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventSession", required: true },
    speaker_id: { type: mongoose.Schema.Types.ObjectId, ref: "Speaker", required: true },
    role: {
      type: String,
      enum: ["speaker", "moderator", "panelist", "host", "keynote"],
      required: true,
      default: "speaker",
    },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

sessionSpeakersSchema.index({ session_id: 1, speaker_id: 1 }, { unique: true });
sessionSpeakersSchema.index({ speaker_id: 1 });

module.exports = mongoose.model("SessionSpeaker", sessionSpeakersSchema);
