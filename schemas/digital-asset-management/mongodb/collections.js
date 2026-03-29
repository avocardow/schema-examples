// collections: Curated groupings of assets for sharing and organization.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: null },
    cover_asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      default: null,
    },
    is_public: { type: Boolean, required: true, default: false },
    asset_count: { type: Number, required: true, default: 0 },
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
collectionSchema.index({ workspace_id: 1 });
collectionSchema.index({ created_by: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
