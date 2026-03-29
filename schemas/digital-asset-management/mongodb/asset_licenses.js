// asset_licenses: License assignments linking assets to specific license terms.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const assetLicenseSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    license_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "License",
      required: true,
    },
    effective_date: { type: String, required: true },
    expiry_date: { type: String, default: null },
    notes: { type: String, default: null },
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
assetLicenseSchema.index({ asset_id: 1 });
assetLicenseSchema.index({ license_id: 1 });
assetLicenseSchema.index({ expiry_date: 1 });

module.exports = mongoose.model("AssetLicense", assetLicenseSchema);
