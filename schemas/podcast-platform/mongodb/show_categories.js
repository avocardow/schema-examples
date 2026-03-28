// show_categories: Junction table linking shows to categories, with a primary category flag.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const show_categoriesSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    is_primary: { type: Boolean, required: true, default: false },
  },
  { timestamps: false }
);

show_categoriesSchema.index({ show_id: 1, category_id: 1 }, { unique: true });
show_categoriesSchema.index({ category_id: 1 });

module.exports = mongoose.model("ShowCategory", show_categoriesSchema);
