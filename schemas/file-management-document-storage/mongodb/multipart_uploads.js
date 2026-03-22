// multipart_uploads: Resumable upload session tracking — lifecycle management from initiation to completion or expiry.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const multipartUploadsSchema = new mongoose.Schema(
  {
    bucket_id: { type: mongoose.Schema.Types.ObjectId, ref: "StorageBucket", required: true },
      // Target bucket for the upload. Cascade: deleting a bucket cancels all its pending uploads.
    storage_key: { type: String, required: true }, // Intended storage path for the completed file.
    filename: { type: String, required: true }, // Intended filename for the completed file.
    mime_type: { type: String }, // Expected MIME type. Nullable: may not be known at initiation.
    total_size: { type: Number }, // Expected total size in bytes. Nullable: tus supports Upload-Defer-Length.
    uploaded_size: { type: Number, required: true, default: 0 }, // Bytes received so far.
    part_count: { type: Number, required: true, default: 0 }, // Number of parts received so far.

    status: {
      type: String,
      enum: ["in_progress", "completing", "completed", "aborted", "expired"],
      required: true,
      default: "in_progress",
    },
    upload_type: {
      type: String,
      enum: ["single", "multipart", "resumable"],
      required: true,
      default: "single",
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Upload metadata key-value pairs from the client.

    initiated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      // Who started the upload.
    expires_at: { type: Date, required: true }, // Server-set expiry for cleanup. Always set.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

multipartUploadsSchema.index({ bucket_id: 1, status: 1 });
multipartUploadsSchema.index({ initiated_by: 1 });
multipartUploadsSchema.index({ expires_at: 1, status: 1 });
multipartUploadsSchema.index({ status: 1 });

module.exports = mongoose.model("MultipartUpload", multipartUploadsSchema);
