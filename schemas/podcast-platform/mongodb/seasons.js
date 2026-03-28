// seasons: Seasonal groupings for serial podcast shows.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const seasonsSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    season_number: { type: Number, required: true },
    name: { type: String, default: null },
    description: { type: String, default: null },
    artwork_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
  },
  { timestamps: false }
);

seasonsSchema.index({ show_id: 1, season_number: 1 }, { unique: true });

module.exports = mongoose.model("Season", seasonsSchema);
