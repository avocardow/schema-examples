// file_shortcuts: Cross-folder references without file duplication — similar to Google Drive shortcuts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileShortcutsSchema = new mongoose.Schema(
  {
    folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true }, // The folder where this shortcut lives.

    // What the shortcut points to. Exactly one of target_file_id or target_folder_id must be set.
    target_type: { type: String, enum: ["file", "folder"], required: true }, // Discriminator for which FK is populated.
    target_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" }, // Populated when target_type = 'file'.
    target_folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, // Populated when target_type = 'folder'.

    name: { type: String }, // Override display name. Null = use the target's name.
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

fileShortcutsSchema.index({ folder_id: 1 });
fileShortcutsSchema.index({ target_file_id: 1 });
fileShortcutsSchema.index({ target_folder_id: 1 });

module.exports = mongoose.model("FileShortcut", fileShortcutsSchema);
