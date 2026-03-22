// multipart_upload_parts: Individual parts of a multipart upload, assembled into the final file on completion.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const multipartUploadPartsSchema = new mongoose.Schema(
  {
    upload_id: { type: mongoose.Schema.Types.ObjectId, ref: "MultipartUpload", required: true },

    part_number: { type: Number, required: true }, // 1-based ordering. Parts are assembled in part_number order.

    size: { type: Number, required: true }, // This part's size in bytes. Use Number (safe up to 2^53).

    checksum: { type: String }, // Per-part integrity hash (e.g., MD5, CRC32).

    storage_key: { type: String, required: true }, // Temporary storage location for this part.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

multipartUploadPartsSchema.index({ upload_id: 1, part_number: 1 }, { unique: true });

module.exports = mongoose.model("MultipartUploadPart", multipartUploadPartsSchema);
