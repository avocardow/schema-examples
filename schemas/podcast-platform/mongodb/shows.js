// shows: Podcast show profiles including metadata, feed settings, and audience stats.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const showsSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    network_id: { type: mongoose.Schema.Types.ObjectId, ref: "Network", default: null },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    html_description: { type: String, default: null },
    author: { type: String, required: true },
    language: { type: String, required: true, default: "en" },
    show_type: { type: String, enum: ["episodic", "serial"], required: true, default: "episodic" },
    explicit: { type: Boolean, required: true, default: false },
    artwork_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    banner_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    feed_url: { type: String, default: null },
    website: { type: String, default: null },
    copyright: { type: String, default: null },
    owner_name: { type: String, default: null },
    owner_email: { type: String, default: null },
    podcast_guid: { type: String, default: null },
    medium: { type: String, enum: ["podcast", "music", "video", "audiobook", "newsletter"], required: true, default: "podcast" },
    is_complete: { type: Boolean, required: true, default: false },
    episode_count: { type: Number, required: true, default: 0 },
    subscriber_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

showsSchema.index({ owner_id: 1 });
showsSchema.index({ network_id: 1 });
showsSchema.index({ language: 1, show_type: 1 });
showsSchema.index({ subscriber_count: 1 });

module.exports = mongoose.model("Show", showsSchema);
