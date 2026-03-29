// meal_plans: Weekly or custom-range meal plans created by users.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

mealPlanSchema.index({ created_by: 1 });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
