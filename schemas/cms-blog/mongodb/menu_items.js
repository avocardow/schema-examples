// menu_items: Individual navigation links within a menu supporting nesting.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const menuItemsSchema = new mongoose.Schema(
  {
    menu_id: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", default: null },
    label: { type: String, required: true },
    link_type: { type: String, enum: ["post", "category", "custom"], required: true },
    link_post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    link_category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    link_url: { type: String, default: null },
    open_in_new_tab: { type: Boolean, required: true, default: false },
    sort_order: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
menuItemsSchema.index({ menu_id: 1, parent_id: 1, sort_order: 1 });
menuItemsSchema.index({ link_post_id: 1 });
menuItemsSchema.index({ link_category_id: 1 });
module.exports = mongoose.model("MenuItem", menuItemsSchema);
