// contacts: Email contacts with subscription status and metadata.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed", "bounced", "complained"],
      required: true,
      default: "active",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

contactSchema.index({ status: 1 });
contactSchema.index({ created_at: 1 });

module.exports = mongoose.model("Contact", contactSchema);
