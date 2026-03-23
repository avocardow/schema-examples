// profiles: Stores user profile information, display settings, and social counters.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const profilesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    display_name: { type: String, default: null },
    bio: { type: String, default: null },
    avatar_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    banner_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    website: { type: String, default: null },
    location: { type: String, default: null },
    is_private: { type: Boolean, required: true, default: false },
    follower_count: { type: Number, required: true, default: 0 },
    following_count: { type: Number, required: true, default: 0 },
    post_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

profilesSchema.index({ is_private: 1 });

module.exports = mongoose.model("Profile", profilesSchema);
