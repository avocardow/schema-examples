// collection_assets: Join table linking assets to collections with ordering.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const collectionAssetSchema = new mongoose.Schema(
  {
    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    position: { type: Number, required: true, default: 0 },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "added_at", updatedAt: false },
  }
);

// Indexes
collectionAssetSchema.index(
  { collection_id: 1, asset_id: 1 },
  { unique: true }
);
collectionAssetSchema.index({ asset_id: 1 });

module.exports = mongoose.model("CollectionAsset", collectionAssetSchema);
