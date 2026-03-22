// files: Core file entity — metadata about stored bytes (the "blob" in the blob + attachment split).
// See README.md for full design rationale.

const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
  {
    bucket_id: { type: mongoose.Schema.Types.ObjectId, ref: "StorageBucket", required: true },
    folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, // Null = bucket root (no folder).

    // Identity and display
    name: { type: String, required: true }, // Current display filename (e.g., "Q4 Report.pdf").
    original_filename: { type: String, required: true }, // Filename at upload time. Never changes after upload.
    storage_key: { type: String, unique: true, required: true }, // Path to bytes in the storage backend. Immutable after upload.

    // File properties
    mime_type: { type: String, required: true }, // MIME type (e.g., "application/pdf", "image/png").
    size: { type: Number, required: true }, // File size in bytes.
    checksum_sha256: { type: String }, // SHA-256 hash for duplicate detection and integrity verification.
    etag: { type: String }, // HTTP ETag for cache validation.

    // Versioning: pointer to the current active version.
    // Null until the first version is explicitly created (versioning may be off for the bucket).
    current_version_id: { type: mongoose.Schema.Types.ObjectId, ref: "FileVersion" },

    // Metadata
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // System-extracted metadata.
    user_metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // User-defined key-value pairs.

    // Ownership
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    is_public: { type: Boolean, required: true, default: false },

    // Soft delete
    deleted_at: { type: Date },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    original_folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

filesSchema.index({ bucket_id: 1, folder_id: 1 });
filesSchema.index({ uploaded_by: 1 });
filesSchema.index({ mime_type: 1 });
filesSchema.index({ deleted_at: 1 });
filesSchema.index({ checksum_sha256: 1 });
filesSchema.index({ bucket_id: 1, deleted_at: 1 });

module.exports = mongoose.model("File", filesSchema);
