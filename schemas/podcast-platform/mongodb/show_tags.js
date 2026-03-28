// show_tags: Tags associated with shows for categorisation and discovery.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const show_tagsSchema = new mongoose.Schema(
  {
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    tag: { type: String, required: true },
  },
  { timestamps: false }
);

show_tagsSchema.index({ show_id: 1, tag: 1 }, { unique: true });
show_tagsSchema.index({ tag: 1 });

module.exports = mongoose.model("ShowTag", show_tagsSchema);
