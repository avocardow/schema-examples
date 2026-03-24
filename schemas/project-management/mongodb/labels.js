// labels: Project-scoped label definitions for categorizing tasks.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const labelsSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    color: { type: String, default: null },
    description: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

labelsSchema.index({ project_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Label", labelsSchema);
