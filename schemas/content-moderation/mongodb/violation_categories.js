// violation_categories: Hierarchical taxonomy of content violation types.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const violationCategorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true }, // Machine-readable identifier (e.g., "hate_speech", "csam").
    display_name: { type: String, required: true }, // Human-readable label (e.g., "Hate Speech").
    description: { type: String, default: null }, // Detailed explanation of what this category covers.
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationCategory",
      default: null,
    }, // Parent category for hierarchical taxonomy. Null = top-level.

    // info = informational/advisory.
    // low = minor policy violation.
    // medium = standard violation.
    // high = serious violation requiring prompt action.
    // critical = illegal content, imminent harm — highest priority.
    severity: {
      type: String,
      enum: ["info", "low", "medium", "high", "critical"],
      required: true,
      default: "medium",
    },

    is_active: { type: Boolean, required: true, default: true }, // Soft-disable without deleting.
    sort_order: { type: Number, required: true, default: 0 }, // Display ordering within the parent group.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
violationCategorySchema.index({ parent_id: 1 });
violationCategorySchema.index({ is_active: 1, sort_order: 1 });

module.exports = mongoose.model("ViolationCategory", violationCategorySchema);
