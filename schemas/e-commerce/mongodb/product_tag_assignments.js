// product_tag_assignments: Join table linking products to their assigned tags.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const productTagAssignmentsSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductTag", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
productTagAssignmentsSchema.index({ product_id: 1, tag_id: 1 }, { unique: true });
productTagAssignmentsSchema.index({ tag_id: 1 });
module.exports = mongoose.model("ProductTagAssignment", productTagAssignmentsSchema);
