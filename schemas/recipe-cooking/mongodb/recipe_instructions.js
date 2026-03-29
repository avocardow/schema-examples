// recipe_instructions: Step-by-step instructions for preparing a recipe.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeInstructionSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    step_number: { type: Number, required: true },
    instruction: { type: String, required: true },
    section_label: { type: String, default: null },
    time_minutes: { type: Number, default: null },
  },
  {
    timestamps: false,
  }
);

recipeInstructionSchema.index(
  { recipe_id: 1, step_number: 1 },
  { unique: true }
);

module.exports = mongoose.model("RecipeInstruction", recipeInstructionSchema);
