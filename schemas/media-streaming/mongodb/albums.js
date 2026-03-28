// albums: Music albums, singles, EPs, and compilations with metadata and popularity.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const albumsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    label_id: { type: mongoose.Schema.Types.ObjectId, ref: "Label", default: null },
    album_type: { type: String, enum: ["album", "single", "ep", "compilation"], required: true, default: "album" },
    cover_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    release_date: { type: String, default: null },
    total_tracks: { type: Number, required: true, default: 0 },
    total_duration_ms: { type: Number, required: true, default: 0 },
    upc: { type: String, default: null },
    copyright: { type: String, default: null },
    popularity: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

albumsSchema.index({ artist_id: 1, release_date: 1 });
albumsSchema.index({ label_id: 1 });
albumsSchema.index({ album_type: 1, release_date: 1 });
albumsSchema.index({ popularity: 1 });
albumsSchema.index({ release_date: 1 });

module.exports = mongoose.model("Album", albumsSchema);
