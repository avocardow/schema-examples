// providers: Service providers with availability and profile information.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const providersSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    display_name: { type: String, required: true },
    bio: { type: String, default: null },
    avatar_url: { type: String, default: null },
    timezone: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    is_accepting: { type: Boolean, required: true, default: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

providersSchema.index({ is_active: 1, is_accepting: 1 });
providersSchema.index({ is_active: 1, position: 1 });

module.exports = mongoose.model("Provider", providersSchema);
