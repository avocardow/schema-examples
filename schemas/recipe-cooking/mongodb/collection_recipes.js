// collection_recipes: Recipes added to a collection with ordering.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const collectionRecipeSchema = new mongoose.Schema(
  {
    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    position: { type: Number, required: true, default: 0 },
    added_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

collectionRecipeSchema.index(
  { collection_id: 1, recipe_id: 1 },
  { unique: true }
);
collectionRecipeSchema.index({ recipe_id: 1 });

module.exports = mongoose.model("CollectionRecipe", collectionRecipeSchema);
