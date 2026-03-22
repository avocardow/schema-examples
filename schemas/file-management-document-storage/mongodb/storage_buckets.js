// storage_buckets: Logical containers for files with per-bucket configuration and upload constraints.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const storageBucketsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true }, // Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).
    description: { type: String }, // Explain what this bucket is for.

    // Controls anonymous read access to files in this bucket.
    // false = all access requires authentication.
    // true = files are publicly readable (e.g., CDN-served assets).
    is_public: { type: Boolean, required: true, default: false },

    allowed_mime_types: { type: [String], default: undefined }, // Whitelist of accepted MIME types. Null = all types allowed.
    max_file_size: { type: Number }, // Maximum file size in bytes. Null = no limit.

    // Whether files in this bucket track version history.
    versioning_enabled: { type: Boolean, required: true, default: false },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("StorageBucket", storageBucketsSchema);
