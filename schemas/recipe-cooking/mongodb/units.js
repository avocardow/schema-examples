// units: Measurement units for ingredient quantities.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    abbreviation: { type: String, default: null },
    system: {
      type: String,
      enum: ["metric", "imperial", "universal"],
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("Unit", unitSchema);
