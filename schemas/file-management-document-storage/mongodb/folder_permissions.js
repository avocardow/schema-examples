// folder_permissions: Per-user permission grants on folders, supporting inherited and directly assigned access.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const folderPermissionsSchema = new mongoose.Schema(
  {
    folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    permission: { type: String, enum: ["view", "edit", "manage"], default: "view" },
    inherited: { type: Boolean, default: false },
    granted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

folderPermissionsSchema.index({ folder_id: 1, user_id: 1 }, { unique: true });
folderPermissionsSchema.index({ user_id: 1 });
folderPermissionsSchema.index({ folder_id: 1 });

module.exports = mongoose.model("FolderPermission", folderPermissionsSchema);
