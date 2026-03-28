// people: Podcast hosts, guests, and contributors with public profile and identity fields.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    bio: { type: String, default: null },
    url: { type: String, default: null },
    image_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    podcast_index_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

peopleSchema.index({ name: 1 });

module.exports = mongoose.model("Person", peopleSchema);
