// categories: Hierarchical taxonomy for classifying podcast shows and episodes.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

categoriesSchema.index({ parent_id: 1 });

module.exports = mongoose.model("Category", categoriesSchema);
