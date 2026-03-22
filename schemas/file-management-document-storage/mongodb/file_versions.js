// file_versions: Immutable version history for files — each row is a point-in-time snapshot with its own storage key.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileVersionsSchema = new mongoose.Schema(
  {
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
      // Which file this version belongs to. Cascade: deleting a file removes all its versions.
    version_number: { type: Number, required: true }, // Monotonic counter per file: 1, 2, 3, ...
    storage_key: { type: String, unique: true, required: true }, // Path to this version's bytes.
    size: { type: Number, required: true }, // This version's file size in bytes.
    checksum_sha256: { type: String }, // This version's content hash.
    mime_type: { type: String, required: true }, // This version's MIME type. May differ between versions.
    change_summary: { type: String }, // Human-readable description of what changed.

    // Denormalized flag: true for the active version.
    // Kept in sync with files.current_version_id.
    is_current: { type: Boolean, required: true, default: false },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      // Who uploaded this version.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    // No updated_at — versions are immutable (append-only).
  }
);

fileVersionsSchema.index({ file_id: 1, version_number: 1 }, { unique: true });
fileVersionsSchema.index({ file_id: 1, is_current: 1 });

module.exports = mongoose.model("FileVersion", fileVersionsSchema);
