// recipe_ingredients: Ingredients linked to a recipe with quantity and ordering.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeIngredientSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    quantity: { type: Number, default: null },
    note: { type: String, default: null },
    section_label: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
    optional: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: false,
  }
);

recipeIngredientSchema.index({ recipe_id: 1, position: 1 });
recipeIngredientSchema.index({ food_id: 1 });

module.exports = mongoose.model("RecipeIngredient", recipeIngredientSchema);
