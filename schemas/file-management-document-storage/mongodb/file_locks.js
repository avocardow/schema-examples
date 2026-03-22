// file_locks: Collaborative file locking to prevent concurrent edits — one lock per file.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fileLocksSchema = new mongoose.Schema(
  {
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true, unique: true },
                                                   // Only one lock per file at a time.
                                                   // Cascade: deleting a file releases its lock.
    locked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                                                   // Who holds the lock.
                                                   // Cascade: deleting a user releases their locks.
    lock_type: {
      type: String,
      enum: ["exclusive", "shared"],
      required: true,
      default: "exclusive",
    }, // exclusive = only lock holder can edit. shared = cooperative read-only mode.
    reason: { type: String },                      // Why the file is locked.
    expires_at: { type: Date },                    // When the lock automatically expires. Null = indefinite.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    // No updatedAt — locks are short-lived; to extend, release and re-acquire.
  }
);

fileLocksSchema.index({ locked_by: 1 });
fileLocksSchema.index({ expires_at: 1 });

module.exports = mongoose.model("FileLock", fileLocksSchema);
