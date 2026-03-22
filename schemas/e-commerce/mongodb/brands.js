// brands: Product brand identities with display ordering and active status.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const brandsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    logo_url: { type: String, default: null },
    website_url: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

brandsSchema.index({ is_active: 1, sort_order: 1 });

module.exports = mongoose.model("Brand", brandsSchema);
