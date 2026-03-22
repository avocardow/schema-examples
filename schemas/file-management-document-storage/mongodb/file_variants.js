// file_variants: Thumbnails, resized images, and transformed derivatives of a source file.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileVariantsSchema = new mongoose.Schema(
  {
    source_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true }, // The original file this variant was generated from.
    variant_key: { type: String, required: true }, // Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").
    storage_key: { type: String, unique: true, required: true }, // Path to the variant's bytes.
    mime_type: { type: String, required: true }, // May differ from source (e.g., JPEG source → WebP variant).
    width: { type: Number }, // Variant width in pixels. Null for non-image variants.
    height: { type: Number }, // Variant height in pixels. Null for non-image variants.
    size: { type: Number, required: true }, // Variant file size in bytes.
    transform_params: { type: mongoose.Schema.Types.Mixed }, // The transformation parameters that produced this variant.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

fileVariantsSchema.index({ source_file_id: 1, variant_key: 1 }, { unique: true });

module.exports = mongoose.model("FileVariant", fileVariantsSchema);
