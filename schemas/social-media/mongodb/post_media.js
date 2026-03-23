// post_media: Stores media attachments linked to posts with ordering and dimensions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const postMediaSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    media_type: { type: String, enum: ["image", "video", "gif"], required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    alt_text: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

postMediaSchema.index({ post_id: 1, position: 1 });
postMediaSchema.index({ file_id: 1 });

module.exports = mongoose.model("PostMedia", postMediaSchema);
