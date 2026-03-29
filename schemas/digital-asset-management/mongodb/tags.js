// tags: Workspace-scoped labels for categorizing assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
tagSchema.index({ workspace_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Tag", tagSchema);
