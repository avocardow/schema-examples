// artists: Musical artists with profile info, verification status, and popularity metrics.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const artistsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    bio: { type: String, default: null },
    image_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    banner_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    is_verified: { type: Boolean, required: true, default: false },
    follower_count: { type: Number, required: true, default: 0 },
    monthly_listeners: { type: Number, required: true, default: 0 },
    popularity: { type: Number, required: true, default: 0 },
    external_url: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

artistsSchema.index({ popularity: 1 });
artistsSchema.index({ name: 1 });

module.exports = mongoose.model("Artist", artistsSchema);
