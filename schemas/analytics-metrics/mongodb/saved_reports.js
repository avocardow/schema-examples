// saved_reports: User-saved report configurations with visibility controls.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const savedReportsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    visibility: { type: String, enum: ["private", "team", "public"], required: true, default: "private" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

savedReportsSchema.index({ created_by: 1 });
savedReportsSchema.index({ visibility: 1 });

module.exports = mongoose.model("SavedReport", savedReportsSchema);
