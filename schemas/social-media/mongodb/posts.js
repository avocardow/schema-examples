// posts: Stores user-created posts with threading, quoting, and visibility controls.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: null },
    content_type: { type: String, enum: ["text", "system", "deleted"], required: true, default: "text" },
    reply_to_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    quote_of_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    visibility: { type: String, enum: ["public", "unlisted", "followers_only", "mentioned_only"], required: true, default: "public" },
    is_edited: { type: Boolean, required: true, default: false },
    edited_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
    reply_count: { type: Number, required: true, default: 0 },
    reaction_count: { type: Number, required: true, default: 0 },
    repost_count: { type: Number, required: true, default: 0 },
    poll_id: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postsSchema.index({ author_id: 1, created_at: 1 });
postsSchema.index({ reply_to_id: 1 });
postsSchema.index({ conversation_id: 1, created_at: 1 });
postsSchema.index({ visibility: 1, created_at: 1 });
postsSchema.index({ expires_at: 1 });
postsSchema.index({ quote_of_id: 1 });

module.exports = mongoose.model("Post", postsSchema);
