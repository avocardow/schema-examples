// recipe_favorites: Tracks which users have favorited which recipes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeFavoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

recipeFavoriteSchema.index({ recipe_id: 1, user_id: 1 }, { unique: true });
recipeFavoriteSchema.index({ user_id: 1 });

module.exports = mongoose.model("RecipeFavorite", recipeFavoriteSchema);
