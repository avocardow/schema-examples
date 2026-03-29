// assets: Core table storing digital asset metadata and file information.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    name: { type: String, required: true },
    original_filename: { type: String, required: true },
    description: { type: String, default: null },
    storage_key: { type: String, required: true, unique: true },
    mime_type: { type: String, required: true },
    file_size: { type: Number, required: true },
    file_extension: { type: String, required: true },
    asset_type: {
      type: String,
      required: true,
      enum: ["image", "video", "audio", "document", "font", "archive", "other"],
    },
    status: {
      type: String,
      required: true,
      default: "draft",
      enum: ["draft", "active", "archived", "expired"],
    },
    current_version_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetVersion",
      default: null,
    },
    version_count: { type: Number, required: true, default: 1 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    duration_seconds: { type: Number, default: null },
    color_space: { type: String, default: null },
    dpi: { type: Number, default: null },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checksum_sha256: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
assetSchema.index({ workspace_id: 1, folder_id: 1 });
assetSchema.index({ workspace_id: 1, asset_type: 1 });
assetSchema.index({ workspace_id: 1, status: 1 });
assetSchema.index({ uploaded_by: 1 });
assetSchema.index({ mime_type: 1 });

module.exports = mongoose.model("Asset", assetSchema);
