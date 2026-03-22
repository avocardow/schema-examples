// file_shares: Direct access grants to specific users, groups, or organizations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileSharesSchema = new mongoose.Schema(
  {
    // What is being shared. Exactly one of target_file_id or target_folder_id must be set.
    target_type: { type: String, enum: ["file", "folder"], required: true }, // Discriminator for which FK is populated.
    target_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" }, // Populated when target_type = 'file'.
    target_folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, // Populated when target_type = 'folder'.

    shared_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who created this share.

    // Who the share is granted to. Target depends on shared_with_type.
    shared_with_type: { type: String, enum: ["user", "group", "organization"], required: true },
    shared_with_id: { type: String, required: true }, // Polymorphic — not a FK.

    role: { type: String, enum: ["viewer", "commenter", "editor", "co_owner"], required: true },
    allow_reshare: { type: Boolean, required: true, default: false }, // Whether the recipient can share this item with others.
    expires_at: { type: Date }, // Null = never expires.
    accepted_at: { type: Date }, // Null = pending acceptance.
    message: { type: String }, // Optional message to the recipient.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

fileSharesSchema.index({ target_type: 1, target_file_id: 1 });
fileSharesSchema.index({ target_type: 1, target_folder_id: 1 });
fileSharesSchema.index({ shared_with_type: 1, shared_with_id: 1 });
fileSharesSchema.index({ shared_by: 1 });
fileSharesSchema.index({ expires_at: 1 });

module.exports = mongoose.model("FileShare", fileSharesSchema);
