// foods: Canonical list of food items used as recipe ingredients.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

foodSchema.index({ category: 1 });

module.exports = mongoose.model("Food", foodSchema);
