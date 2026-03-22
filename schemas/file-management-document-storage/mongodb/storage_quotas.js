// storage_quotas: Per-entity storage limits and usage tracking for users, organizations, or buckets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const storageQuotasSchema = new mongoose.Schema(
  {
    entity_type: {
      type: String,
      enum: ["user", "organization", "bucket"],
      required: true,
    },
    entity_id: { type: String, required: true }, // Polymorphic — references users, organizations, or storage_buckets depending on entity_type.

    quota_bytes: { type: Number, required: true }, // Storage limit in bytes. Enforced at upload time.
    used_bytes: { type: Number, required: true, default: 0 }, // Cached: total bytes consumed. Updated on upload/delete.
    file_count: { type: Number, required: true, default: 0 }, // Cached: total file count. Updated on upload/delete.
    last_computed_at: { type: Date }, // When usage was last recomputed by a background job. Null = never recomputed.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

storageQuotasSchema.index({ entity_type: 1, entity_id: 1 }, { unique: true });
storageQuotasSchema.index({ entity_type: 1 });

module.exports = mongoose.model("StorageQuota", storageQuotasSchema);
