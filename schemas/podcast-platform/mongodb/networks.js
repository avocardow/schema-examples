// networks: Podcast network profiles grouping shows under a shared brand.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const networksSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    website: { type: String, default: null },
    logo_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

networksSchema.index({ name: 1 });

module.exports = mongoose.model("Network", networksSchema);
