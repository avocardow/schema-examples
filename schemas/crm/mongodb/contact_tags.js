// contact_tags: Join table linking contacts to tags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactTagsSchema = new mongoose.Schema(
  {
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

contactTagsSchema.index({ contact_id: 1, tag_id: 1 }, { unique: true });
contactTagsSchema.index({ tag_id: 1 });

module.exports = mongoose.model("ContactTag", contactTagsSchema);
