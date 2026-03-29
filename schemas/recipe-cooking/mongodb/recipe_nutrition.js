// recipe_nutrition: Nutritional information per recipe serving.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeNutritionSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
      unique: true,
    },
    calories: { type: Number, default: null },
    total_fat_grams: { type: Number, default: null },
    saturated_fat_grams: { type: Number, default: null },
    carbohydrates_grams: { type: Number, default: null },
    fiber_grams: { type: Number, default: null },
    sugar_grams: { type: Number, default: null },
    protein_grams: { type: Number, default: null },
    sodium_mg: { type: Number, default: null },
    cholesterol_mg: { type: Number, default: null },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("RecipeNutrition", recipeNutritionSchema);
