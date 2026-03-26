// vendors: Core vendor/seller accounts on the marketplace.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "deactivated"],
      required: true,
      default: "pending",
    },
    verification_status: {
      type: String,
      enum: ["unverified", "pending_review", "verified", "rejected"],
      required: true,
      default: "unverified",
    },
    commission_rate: { type: Number, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    approved_at: { type: Date, default: null },
    suspended_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

vendorSchema.index({ owner_id: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ verification_status: 1 });

module.exports = mongoose.model("Vendor", vendorSchema);
