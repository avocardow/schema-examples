// playlists: User-created playlists of podcast episodes, supporting manual curation and smart filter rules.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const playlistsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    playlist_type: { type: String, enum: ["manual", "smart"], required: true, default: "manual" },
    smart_filters: { type: mongoose.Schema.Types.Mixed, default: null },
    is_public: { type: Boolean, required: true, default: false },
    episode_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

playlistsSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("Playlist", playlistsSchema);
