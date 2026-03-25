// canned_responses: Reusable reply templates for common support scenarios.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const cannedResponsesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    folder: { type: String, default: null },
    created_by_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    is_shared: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

cannedResponsesSchema.index({ folder: 1 });
cannedResponsesSchema.index({ created_by_id: 1 });
cannedResponsesSchema.index({ is_shared: 1 });

module.exports = mongoose.model("CannedResponse", cannedResponsesSchema);
