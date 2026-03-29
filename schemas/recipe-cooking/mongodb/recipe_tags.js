// recipe_tags: Many-to-many link between recipes and tags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeTagSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    tag_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

recipeTagSchema.index({ recipe_id: 1, tag_id: 1 }, { unique: true });
recipeTagSchema.index({ tag_id: 1 });

module.exports = mongoose.model("RecipeTag", recipeTagSchema);
