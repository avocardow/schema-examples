// speakers: Individuals who present at event sessions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const speakersSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    email: { type: String, default: null },
    bio: { type: String, default: null },
    title: { type: String, default: null },
    company: { type: String, default: null },
    avatar_url: { type: String, default: null },
    website_url: { type: String, default: null },
    twitter_handle: { type: String, default: null },
    linkedin_url: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

speakersSchema.index({ user_id: 1 });
speakersSchema.index({ is_active: 1 });

module.exports = mongoose.model("Speaker", speakersSchema);
