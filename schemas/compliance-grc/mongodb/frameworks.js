// frameworks: Regulatory and compliance frameworks tracked by the organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const frameworkSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    name: { type: String, required: true },
    version: { type: String, default: null },
    authority: { type: String, default: null },
    description: { type: String, default: null },
    website_url: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

frameworkSchema.index({ organization_id: 1 });
frameworkSchema.index({ is_active: 1 });

module.exports = mongoose.model("Framework", frameworkSchema);
