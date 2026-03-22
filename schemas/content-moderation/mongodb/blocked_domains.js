// blocked_domains: Domain-level content blocking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const blockedDomainsSchema = new mongoose.Schema(
  {
    domain: { type: String, unique: true, required: true }, // The blocked domain (e.g., "spam-site.com").

    // full = all content from this domain is blocked.
    // media_only = text content allowed, media rejected.
    // report_reject = reports from this domain's users are ignored.
    block_type: {
      type: String,
      enum: ["full", "media_only", "report_reject"],
      required: true,
      default: "full",
    },

    reason: { type: String, default: null }, // Why this domain was blocked.
    public_comment: { type: String, default: null }, // Comment visible to users about why the domain is blocked.
    private_comment: { type: String, default: null }, // Internal moderator note. Not visible to users.
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
blockedDomainsSchema.index({ block_type: 1 });
blockedDomainsSchema.index({ created_by: 1 });

module.exports = mongoose.model("BlockedDomain", blockedDomainsSchema);
