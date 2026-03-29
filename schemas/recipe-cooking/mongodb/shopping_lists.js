// shopping_lists: User-created shopping lists optionally linked to a meal plan.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    meal_plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPlan",
      default: null,
    },
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

shoppingListSchema.index({ created_by: 1 });
shoppingListSchema.index({ meal_plan_id: 1 });

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
