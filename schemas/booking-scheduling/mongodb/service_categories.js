// service_categories: Organizes services into hierarchical categories.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const serviceCategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", default: null },
    position: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

serviceCategoriesSchema.index({ parent_id: 1 });
serviceCategoriesSchema.index({ is_active: 1, position: 1 });

module.exports = mongoose.model("ServiceCategory", serviceCategoriesSchema);
