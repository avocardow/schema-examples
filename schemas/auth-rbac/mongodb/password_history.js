// password_history: Previous password hashes for enforcing reuse policies.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const passwordHistorySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    password_hash: { type: String, required: true }, // Previous password hash. Compared against new passwords to prevent reuse.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

passwordHistorySchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("PasswordHistory", passwordHistorySchema);
