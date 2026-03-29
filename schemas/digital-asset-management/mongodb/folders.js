// folders: Hierarchical folder structure for organizing assets within workspaces.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    name: { type: String, required: true },
    path: { type: String, required: true },
    depth: { type: Number, required: true, default: 0 },
    description: { type: String, default: null },
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
folderSchema.index({ workspace_id: 1, path: 1 }, { unique: true });
folderSchema.index(
  { workspace_id: 1, parent_id: 1, name: 1 },
  { unique: true, sparse: true }
);
folderSchema.index({ parent_id: 1 });
folderSchema.index({ workspace_id: 1, depth: 1 });

module.exports = mongoose.model("Folder", folderSchema);
