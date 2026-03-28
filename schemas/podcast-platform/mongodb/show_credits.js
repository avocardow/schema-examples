// show_credits: Credits linking people to shows with role and group classification.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const show_creditsSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    person_id: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
    role: {
      type: String,
      enum: ["host", "co_host", "guest", "producer", "editor", "sound_designer", "composer", "narrator", "researcher", "writer"],
      required: true,
    },
    group: {
      type: String,
      enum: ["cast", "crew", "writing", "audio_post_production", "video_post_production"],
      required: true,
      default: "cast",
    },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

show_creditsSchema.index({ show_id: 1, person_id: 1, role: 1 }, { unique: true });
show_creditsSchema.index({ person_id: 1 });

module.exports = mongoose.model("ShowCredit", show_creditsSchema);
