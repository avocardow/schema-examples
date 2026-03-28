// saved_albums: Albums saved to a user's personal library.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const savedAlbumsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    album_id: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

savedAlbumsSchema.index({ user_id: 1, album_id: 1 }, { unique: true });
savedAlbumsSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("SavedAlbum", savedAlbumsSchema);
