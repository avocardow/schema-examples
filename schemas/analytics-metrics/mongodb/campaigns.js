// campaigns: Marketing campaign tracking with UTM-style source, medium, and term attributes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const campaignsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    source: { type: String, required: true },
    medium: { type: String, required: true },
    term: { type: String, default: null },
    content: { type: String, default: null },
    landing_url: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

campaignsSchema.index({ source: 1, medium: 1, name: 1 }, { unique: true });
campaignsSchema.index({ is_active: 1 });
campaignsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Campaign", campaignsSchema);
