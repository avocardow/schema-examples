// artist_genres: Many-to-many relationship linking artists to their genres.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const artistGenresSchema = new mongoose.Schema(
  {
    artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
  },
  { timestamps: false }
);

artistGenresSchema.index({ artist_id: 1, genre_id: 1 }, { unique: true });
artistGenresSchema.index({ genre_id: 1 });

module.exports = mongoose.model("ArtistGenre", artistGenresSchema);
