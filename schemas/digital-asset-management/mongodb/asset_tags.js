// asset_tags: Join table associating tags with assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const assetTagSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    tag_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "assigned_at", updatedAt: false },
  }
);

// Indexes
assetTagSchema.index({ asset_id: 1, tag_id: 1 }, { unique: true });
assetTagSchema.index({ tag_id: 1 });

module.exports = mongoose.model("AssetTag", assetTagSchema);
