// asset_versions: Version history tracking for asset file revisions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const assetVersionSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    version_number: { type: Number, required: true },
    storage_key: { type: String, required: true },
    mime_type: { type: String, required: true },
    file_size: { type: Number, required: true },
    file_extension: { type: String, required: true },
    checksum_sha256: { type: String, default: null },
    change_summary: { type: String, default: null },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
assetVersionSchema.index({ asset_id: 1, version_number: 1 }, { unique: true });

module.exports = mongoose.model("AssetVersion", assetVersionSchema);
