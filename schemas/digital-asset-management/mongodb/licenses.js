// licenses: License templates defining usage rights for assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: null },
    license_type: {
      type: String,
      required: true,
      enum: [
        "royalty_free",
        "rights_managed",
        "editorial",
        "creative_commons",
        "internal",
        "custom",
      ],
    },
    territories: { type: mongoose.Schema.Types.Mixed, default: null },
    channels: { type: mongoose.Schema.Types.Mixed, default: null },
    max_uses: { type: Number, default: null },
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

// Indexes
licenseSchema.index({ workspace_id: 1 });
licenseSchema.index({ license_type: 1 });

module.exports = mongoose.model("License", licenseSchema);
