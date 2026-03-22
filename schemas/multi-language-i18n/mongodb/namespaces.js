// namespaces: Logical groupings for translation keys (e.g., "common", "emails", "errors").
// See README.md for full design rationale.

const mongoose = require("mongoose");

const namespacesSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    is_default: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Namespace", namespacesSchema);
