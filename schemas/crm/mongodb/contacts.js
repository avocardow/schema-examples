// contacts: Individual people tracked in the CRM with lifecycle and source info.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactsSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, default: null },
    title: { type: String, default: null },
    lifecycle_stage: {
      type: String,
      enum: [
        "subscriber",
        "lead",
        "qualified",
        "opportunity",
        "customer",
        "evangelist",
        "other",
      ],
      required: true,
      default: "lead",
    },
    source: {
      type: String,
      enum: [
        "web",
        "referral",
        "organic",
        "paid",
        "social",
        "event",
        "cold_outreach",
        "other",
      ],
      default: null,
    },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    avatar_url: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

contactsSchema.index({ owner_id: 1 });
contactsSchema.index({ lifecycle_stage: 1 });

module.exports = mongoose.model("Contact", contactsSchema);
