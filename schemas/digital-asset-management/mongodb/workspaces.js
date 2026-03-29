// workspaces: Top-level organizational units for digital asset management.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    logo_url: { type: String, default: null },
    storage_limit_bytes: { type: Number, default: null },
    storage_used_bytes: { type: Number, required: true, default: 0 },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Workspace", workspaceSchema);
