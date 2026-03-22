// file_tag_assignments: Many-to-many join between files and tags with audit trail.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileTagAssignmentsSchema = new mongoose.Schema(
  {
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "FileTag", required: true },
    tagged_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

fileTagAssignmentsSchema.index({ file_id: 1, tag_id: 1 }, { unique: true });
fileTagAssignmentsSchema.index({ tag_id: 1 });
fileTagAssignmentsSchema.index({ tagged_by: 1 });

module.exports = mongoose.model("FileTagAssignment", fileTagAssignmentsSchema);
