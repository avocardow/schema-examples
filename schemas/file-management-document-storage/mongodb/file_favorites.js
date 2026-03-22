// file_favorites: Per-user file bookmarks (stars) for "starred files" UIs.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileFavoritesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

fileFavoritesSchema.index({ user_id: 1, file_id: 1 }, { unique: true });
fileFavoritesSchema.index({ file_id: 1 });

module.exports = mongoose.model("FileFavorite", fileFavoritesSchema);
