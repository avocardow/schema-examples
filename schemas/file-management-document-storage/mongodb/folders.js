// folders: Folder tree with materialized path for efficient subtree queries.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const foldersSchema = new mongoose.Schema(
  {
    bucket_id: { type: mongoose.Schema.Types.ObjectId, ref: "StorageBucket", required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, // Null = root-level folder within the bucket.
    name: { type: String, required: true }, // Display name (e.g., "Documents", "Photos 2024").

    // Materialized path using folder IDs as segments.
    // Uses IDs (not names) so folder renames don't cascade path updates.
    path: { type: String, required: true },

    depth: { type: Number, required: true, default: 0 }, // Hierarchy level. 0 = root, 1 = child of root, etc.
    description: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

foldersSchema.index({ bucket_id: 1, path: 1 }, { unique: true });
foldersSchema.index({ bucket_id: 1, parent_id: 1, name: 1 }, { unique: true });
foldersSchema.index({ parent_id: 1 });
foldersSchema.index({ bucket_id: 1, depth: 1 });

module.exports = mongoose.model("Folder", foldersSchema);
