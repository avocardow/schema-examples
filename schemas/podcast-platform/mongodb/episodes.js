// episodes: Individual podcast episodes with audio, metadata, and RSS enclosure fields.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const episodesSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    html_description: { type: String, default: null },
    episode_type: { type: String, enum: ["full", "trailer", "bonus"], required: true, default: "full" },
    season_number: { type: Number, default: null },
    episode_number: { type: Number, default: null },
    duration_ms: { type: Number, required: true, default: 0 },
    explicit: { type: Boolean, required: true, default: false },
    audio_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    artwork_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    enclosure_url: { type: String, default: null },
    enclosure_length: { type: Number, default: null },
    enclosure_type: { type: String, default: null },
    guid: { type: String, default: null },
    published_at: { type: Date, default: null },
    is_blocked: { type: Boolean, required: true, default: false },
    play_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

episodesSchema.index({ show_id: 1, published_at: 1 });
episodesSchema.index({ show_id: 1, season_number: 1, episode_number: 1 });
episodesSchema.index({ published_at: 1 });
episodesSchema.index({ guid: 1 });
episodesSchema.index({ show_id: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Episode", episodesSchema);
