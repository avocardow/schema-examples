// asset_downloads: Download event log tracking asset retrieval activity.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const assetDownloadSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    downloaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    share_link_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShareLink",
      default: null,
    },
    preset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DownloadPreset",
      default: null,
    },
    format: { type: String, required: true },
    file_size: { type: Number, required: true },
    ip_address: { type: String, default: null },
    user_agent: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "downloaded_at", updatedAt: false },
  }
);

// Indexes
assetDownloadSchema.index({ asset_id: 1 });
assetDownloadSchema.index({ downloaded_by: 1 });
assetDownloadSchema.index({ downloaded_at: 1 });

module.exports = mongoose.model("AssetDownload", assetDownloadSchema);
