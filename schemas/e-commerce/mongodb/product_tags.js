// product_tags: Freeform tags for flexible product classification and discovery.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const productTagsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
module.exports = mongoose.model("ProductTag", productTagsSchema);
