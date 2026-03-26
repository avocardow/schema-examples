// categories: Hierarchical classification of auction listings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    sort_order: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent_id: 1 });
categorySchema.index({ sort_order: 1 });

module.exports = mongoose.model("Category", categorySchema);
