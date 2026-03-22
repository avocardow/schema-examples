// file_activities: Audit trail for file and folder operations. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileActivitiesSchema = new mongoose.Schema(
  {
    actor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who performed the action. Restrict delete at application level.

    action: {
      type: String,
      enum: [
        "created",
        "uploaded",
        "updated",
        "renamed",
        "moved",
        "copied",
        "deleted",
        "restored",
        "shared",
        "unshared",
        "downloaded",
        "locked",
        "unlocked",
        "commented",
        "version_created",
      ],
      required: true,
    },

    target_type: { type: String, enum: ["file", "folder"], required: true }, // Whether the action was on a file or folder.
    target_id: { type: String, required: true },   // The file or folder ID. Not a FK — target may be permanently deleted.
    target_name: { type: String, required: true },  // Denormalized: file/folder name at the time of the action.

    details: { type: mongoose.Schema.Types.Mixed }, // Action-specific context (e.g., moved: {from_folder_id, to_folder_id}).
    ip_address: { type: String },                   // Client IP address for security audit.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

fileActivitiesSchema.index({ actor_id: 1 });
fileActivitiesSchema.index({ target_type: 1, target_id: 1 });
fileActivitiesSchema.index({ action: 1 });
fileActivitiesSchema.index({ created_at: 1 });

module.exports = mongoose.model("FileActivity", fileActivitiesSchema);
