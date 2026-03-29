// renditions: Pre-generated derivative formats and sizes of assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const renditionSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    preset_name: { type: String, required: true },
    storage_key: { type: String, required: true },
    mime_type: { type: String, required: true },
    file_size: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    format: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
renditionSchema.index({ asset_id: 1, preset_name: 1 }, { unique: true });

module.exports = mongoose.model("Rendition", renditionSchema);
