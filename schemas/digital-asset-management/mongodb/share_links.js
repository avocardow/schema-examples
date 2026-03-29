// share_links: Shareable links for external access to assets or collections.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const shareLinkSchema = new mongoose.Schema(
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
    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },
    token: { type: String, required: true, unique: true },
    password_hash: { type: String, default: null },
    allow_download: { type: Boolean, required: true, default: true },
    expires_at: { type: Date, default: null },
    view_count: { type: Number, required: true, default: 0 },
    max_views: { type: Number, default: null },
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
shareLinkSchema.index({ workspace_id: 1 });
shareLinkSchema.index({ asset_id: 1 });
shareLinkSchema.index({ collection_id: 1 });
shareLinkSchema.index({ expires_at: 1 });

module.exports = mongoose.model("ShareLink", shareLinkSchema);
