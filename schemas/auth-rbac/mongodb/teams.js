// teams: Sub-groups within an organization (e.g., "Engineering", "Marketing").
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    name: { type: String, required: true }, // Display name (e.g., "Engineering").
    slug: { type: String, required: true }, // URL-safe identifier, unique within the org.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

teamsSchema.index({ organization_id: 1, slug: 1 }, { unique: true });
teamsSchema.index({ organization_id: 1 });

module.exports = mongoose.model("Team", teamsSchema);
