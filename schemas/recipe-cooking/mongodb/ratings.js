// ratings: User scores and optional reviews for recipes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, required: true },
    review: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ratingSchema.index({ recipe_id: 1, user_id: 1 }, { unique: true });
ratingSchema.index({ user_id: 1 });

module.exports = mongoose.model("Rating", ratingSchema);
