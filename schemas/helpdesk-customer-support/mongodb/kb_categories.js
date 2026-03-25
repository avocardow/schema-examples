// kb_categories: Hierarchical sections for organizing knowledge base articles.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const kbCategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "KbCategory", default: null },
    sort_order: { type: Number, required: true, default: 0 },
    is_published: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

kbCategoriesSchema.index({ parent_id: 1, sort_order: 1 });

module.exports = mongoose.model("KbCategory", kbCategoriesSchema);
