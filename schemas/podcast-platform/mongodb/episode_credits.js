// episode_credits: Credits linking people to episodes with a specific role and group (cast/crew/etc.).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const episode_creditsSchema = new mongoose.Schema(
  {
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    person_id: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
    role: {
      type: String,
      enum: [
        "host",
        "co_host",
        "guest",
        "producer",
        "editor",
        "sound_designer",
        "composer",
        "narrator",
        "researcher",
        "writer",
      ],
      required: true,
    },
    group: {
      type: String,
      enum: [
        "cast",
        "crew",
        "writing",
        "audio_post_production",
        "video_post_production",
      ],
      required: true,
      default: "cast",
    },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

episode_creditsSchema.index({ person_id: 1 });
episode_creditsSchema.index({ episode_id: 1, person_id: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("EpisodeCredit", episode_creditsSchema);
