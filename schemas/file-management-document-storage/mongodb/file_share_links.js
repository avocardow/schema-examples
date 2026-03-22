// file_share_links: URL-based sharing with optional password protection, expiry, and download tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileShareLinksSchema = new mongoose.Schema(
  {
    // What the link accesses. Exactly one of target_file_id or target_folder_id must be set.
    target_type: { type: String, enum: ["file", "folder"], required: true },
    target_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" }, // Populated when target_type = 'file'.
    target_folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, // Populated when target_type = 'folder'.

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who created this link.

    token: { type: String, required: true, unique: true }, // URL-safe token for the share link.
    scope: {
      type: String,
      enum: ["anyone", "organization", "specific_users"],
      required: true,
      default: "anyone",
    },
    permission: {
      type: String,
      enum: ["view", "download", "edit", "upload"],
      required: true,
      default: "view",
    },
    password_hash: { type: String }, // Hashed — never store plaintext.
    expires_at: { type: Date }, // Null = never expires.
    max_downloads: { type: Number }, // Null = unlimited.
    download_count: { type: Number, required: true, default: 0 }, // Increment atomically on each download.
    name: { type: String }, // Human-readable name (e.g., "Client review link").
    is_active: { type: Boolean, required: true, default: true }, // Disable a link without deleting it.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

fileShareLinksSchema.index({ target_type: 1, target_file_id: 1 });
fileShareLinksSchema.index({ target_type: 1, target_folder_id: 1 });
fileShareLinksSchema.index({ created_by: 1 });
fileShareLinksSchema.index({ expires_at: 1 });

module.exports = mongoose.model("FileShareLink", fileShareLinksSchema);
