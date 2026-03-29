// recipe_activities: Audit log of actions performed on recipes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeActivitySchema = new mongoose.Schema(
  {
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      default: null,
    },
    actor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "created",
        "updated",
        "published",
        "archived",
        "rated",
        "favorited",
        "added_to_collection",
        "added_to_meal_plan",
      ],
      required: true,
    },
    details: { type: mongoose.Schema.Types.Mixed, default: null },
    occurred_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

recipeActivitySchema.index({ recipe_id: 1 });
recipeActivitySchema.index({ actor_id: 1 });
recipeActivitySchema.index({ action: 1 });
recipeActivitySchema.index({ occurred_at: 1 });

module.exports = mongoose.model("RecipeActivity", recipeActivitySchema);
