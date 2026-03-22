// products: Core product catalog entry with status lifecycle and soft delete.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },

    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },

    status: { type: String, enum: ["draft", "active", "archived"], required: true, default: "draft" },
    product_type: { type: String, default: null },

    options: { type: mongoose.Schema.Types.Mixed, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    is_featured: { type: Boolean, required: true, default: false },

    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

productsSchema.index({ category_id: 1 });
productsSchema.index({ brand_id: 1 });
productsSchema.index({ status: 1 });
productsSchema.index({ is_featured: 1 });
productsSchema.index({ deleted_at: 1 });
productsSchema.index({ status: 1, deleted_at: 1 });

module.exports = mongoose.model("Product", productsSchema);
