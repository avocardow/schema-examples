// file_attachments: Polymorphic join table — attach files to any entity in any domain.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileAttachmentsSchema = new mongoose.Schema(
  {
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true }, // The attached file.

    // Polymorphic target: what entity this file is attached to.
    // Not FKs — the target table depends on the consuming domain.
    record_type: { type: String, required: true }, // Entity type (e.g., "products", "users", "posts", "tickets").
    record_id: { type: String, required: true },   // Entity primary key (UUID).

    name: { type: String, required: true },        // Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
    position: { type: Number, required: true, default: 0 }, // Ordering within a slot.
  },
  {
    // Attachments are immutable links. No updated_at.
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Prevent duplicate attachments of the same file in the same slot.
fileAttachmentsSchema.index({ record_type: 1, record_id: 1, name: 1, file_id: 1 }, { unique: true });
fileAttachmentsSchema.index({ file_id: 1 }); // "Where is this file used?" — orphan detection.
fileAttachmentsSchema.index({ record_type: 1, record_id: 1, name: 1 }); // "All files in this slot for this entity."
fileAttachmentsSchema.index({ record_type: 1, record_id: 1 }); // "All attachments for this entity."

module.exports = mongoose.model("FileAttachment", fileAttachmentsSchema);
