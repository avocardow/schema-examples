// contact_tag_assignments: Associates tags with contacts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactTagAssignmentSchema = new mongoose.Schema(
  {
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    tag_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

contactTagAssignmentSchema.index({ contact_id: 1, tag_id: 1 }, { unique: true });
contactTagAssignmentSchema.index({ tag_id: 1 });

module.exports = mongoose.model("ContactTagAssignment", contactTagAssignmentSchema);
