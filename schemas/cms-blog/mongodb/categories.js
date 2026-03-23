// categories: Hierarchical content categories with materialized path.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema(
  {
parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    path: { type: String, required: true },
    depth: { type: Number, required: true, default: 0 },
    sort_order: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
categoriesSchema.index({ slug: 1 }, { unique: true });
categoriesSchema.index({ parent_id: 1 });
categoriesSchema.index({ path: 1 });
categoriesSchema.index({ is_active: 1, sort_order: 1 });
module.exports = mongoose.model("Category", categoriesSchema);
