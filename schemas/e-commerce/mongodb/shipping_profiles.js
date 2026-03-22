// shipping_profiles: Defines shipping behavior profiles for grouping products by fulfillment type.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const shippingProfilesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["default", "digital", "custom"],
      required: true,
      default: "default",
    },
    description: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
shippingProfilesSchema.index({ type: 1 });
module.exports = mongoose.model("ShippingProfile", shippingProfilesSchema);
