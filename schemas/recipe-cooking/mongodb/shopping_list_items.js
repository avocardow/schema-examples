// shopping_list_items: Individual items on a shopping list with check-off tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const shoppingListItemSchema = new mongoose.Schema(
  {
    shopping_list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingList",
      required: true,
    },
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      default: null,
    },
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      default: null,
    },
    quantity: { type: Number, default: null },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    custom_label: { type: String, default: null },
    checked: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: false,
  }
);

shoppingListItemSchema.index({ shopping_list_id: 1, checked: 1 });
shoppingListItemSchema.index({ food_id: 1 });

module.exports = mongoose.model("ShoppingListItem", shoppingListItemSchema);
