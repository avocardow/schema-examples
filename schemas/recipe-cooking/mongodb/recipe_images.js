// recipe_images: Photos associated with a recipe.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeImageSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    image_url: { type: String, required: true },
    caption: { type: String, default: null },
    is_primary: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

recipeImageSchema.index({ recipe_id: 1, position: 1 });

module.exports = mongoose.model("RecipeImage", recipeImageSchema);
