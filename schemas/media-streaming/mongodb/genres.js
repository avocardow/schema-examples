// genres: Music genre categories for classifying artists and tracks.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Genre", genresSchema);
