// templates: Reusable email templates with subject, body, and sender defaults.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    html_body: {
      type: String,
      default: null,
    },
    text_body: {
      type: String,
      default: null,
    },
    from_name: {
      type: String,
      default: null,
    },
    from_email: {
      type: String,
      default: null,
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

templateSchema.index({ created_by: 1 });

module.exports = mongoose.model("Template", templateSchema);
