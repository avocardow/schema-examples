// labels: Record labels that publish and distribute albums.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const labelsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    website: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

labelsSchema.index({ name: 1 });

module.exports = mongoose.model("Label", labelsSchema);
