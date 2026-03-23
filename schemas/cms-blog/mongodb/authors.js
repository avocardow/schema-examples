// authors: Author profiles linking users to display identities.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const authorsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    display_name: { type: String, required: true },
    slug: { type: String, required: true },
    bio: { type: String, default: null },
    avatar_url: { type: String, default: null },
    website_url: { type: String, default: null },
    social_links: { type: mongoose.Schema.Types.Mixed, default: {} },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
authorsSchema.index({ slug: 1 }, { unique: true });
authorsSchema.index({ user_id: 1 }, { unique: true });
module.exports = mongoose.model("Author", authorsSchema);
