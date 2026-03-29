// asset_activities: Audit log of all actions performed on assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const assetActivitySchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      default: null,
    },
    actor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "uploaded",
        "updated",
        "downloaded",
        "shared",
        "commented",
        "tagged",
        "moved",
        "versioned",
        "archived",
        "restored",
        "deleted",
      ],
    },
    details: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "occurred_at", updatedAt: false },
  }
);

// Indexes
assetActivitySchema.index({ workspace_id: 1 });
assetActivitySchema.index({ asset_id: 1 });
assetActivitySchema.index({ actor_id: 1 });
assetActivitySchema.index({ action: 1 });
assetActivitySchema.index({ occurred_at: 1 });

module.exports = mongoose.model("AssetActivity", assetActivitySchema);
