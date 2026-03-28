// playlists: User-created or collaborative playlists with visibility and track counters.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const playlistsSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    cover_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    is_public: { type: Boolean, required: true, default: true },
    is_collaborative: { type: Boolean, required: true, default: false },
    track_count: { type: Number, required: true, default: 0 },
    follower_count: { type: Number, required: true, default: 0 },
    total_duration_ms: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

playlistsSchema.index({ owner_id: 1, created_at: 1 });
playlistsSchema.index({ is_public: 1, follower_count: 1 });

module.exports = mongoose.model("Playlist", playlistsSchema);
