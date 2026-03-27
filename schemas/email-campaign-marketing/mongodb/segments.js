// segments: Dynamic contact groups defined by filter criteria.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    filter_criteria: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

segmentSchema.index({ created_by: 1 });

module.exports = mongoose.model("Segment", segmentSchema);
