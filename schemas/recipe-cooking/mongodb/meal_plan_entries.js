// meal_plan_entries: Individual recipe slots within a meal plan.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const mealPlanEntrySchema = new mongoose.Schema(
  {
    meal_plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPlan",
      required: true,
    },
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    plan_date: { type: String, required: true },
    meal_type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    servings: { type: Number, default: null },
    note: { type: String, default: null },
  },
  {
    timestamps: false,
  }
);

mealPlanEntrySchema.index({ meal_plan_id: 1, plan_date: 1 });
mealPlanEntrySchema.index({ recipe_id: 1 });

module.exports = mongoose.model("MealPlanEntry", mealPlanEntrySchema);
