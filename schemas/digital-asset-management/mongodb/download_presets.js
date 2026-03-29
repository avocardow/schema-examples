// download_presets: Predefined output configurations for asset downloads.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const downloadPresetSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, required: true },
    output_format: { type: String, default: null },
    max_width: { type: Number, default: null },
    max_height: { type: Number, default: null },
    quality: { type: Number, default: null },
    dpi: { type: Number, default: null },
    created_by: {
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
downloadPresetSchema.index({ workspace_id: 1 });

module.exports = mongoose.model("DownloadPreset", downloadPresetSchema);
